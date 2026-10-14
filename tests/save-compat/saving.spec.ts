import { test, expect, type Page } from '@playwright/test';
import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { PDFDocument } from 'pdf-lib';

const origin = 'https://jaypdf.test';
let source: Buffer;

test.beforeAll(async () => {
  const pdf = await PDFDocument.create();
  for (let index = 0; index < 3; index++) {
    pdf.addPage([300 + index, 400]).drawText(`Page ${index + 1}`);
  }
  source = Buffer.from(await pdf.save());
});

test.beforeEach(async ({ context, page }, testInfo) => {
  await context.route('**/*', async route => {
    const url = new URL(route.request().url());
    // WebKit routes local blob reads too; let the browser resolve those bytes.
    if (url.protocol === 'blob:') return route.continue();
    if (url.origin !== origin) return route.abort();
    const pathname = decodeURIComponent(url.pathname);
    const file = path.join(process.cwd(), 'out', pathname.endsWith('/') ? `${pathname}index.html` : pathname);
    const mime: Record<string, string> = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.txt': 'text/plain', '.wasm': 'application/wasm', '.woff2': 'font/woff2', '.png': 'image/png' };
    try { await route.fulfill({ body: await readFile(file), contentType: mime[path.extname(file)] || 'application/octet-stream' }); }
    catch { await route.fulfill({ status: 404, body: '' }); }
  });
  if (testInfo.project.name === 'android-fallback') {
    // Model a browser predating the picker API, using its existing download implementation.
    await page.addInitScript(() => Object.defineProperty(window, 'showSaveFilePicker', { value: undefined, configurable: true }));
  } else if (testInfo.project.name === 'save-picker') {
    await page.addInitScript(() => {
      const scope = window as any;
      scope.saveProbe = { mode: 'save', calls: [], completed: [], aborted: 0 };
      scope.showSaveFilePicker = async ({ suggestedName }: { suggestedName: string }) => {
        const probe = scope.saveProbe;
        probe.calls.push({ suggestedName, active: navigator.userActivation.isActive });
        if (probe.mode === 'cancel') throw new DOMException('Cancelled', 'AbortError');
        if (probe.mode === 'deny') throw new DOMException('Blocked', 'SecurityError');
        let bytes: number[];
        return { createWritable: async () => ({
          write: async (blob: Blob) => {
            if (probe.mode === 'write-error') throw new DOMException('Disk full', 'QuotaExceededError');
            bytes = [...new Uint8Array(await blob.arrayBuffer())];
          },
          close: async () => { probe.completed.push({ suggestedName, bytes }); },
          abort: async () => { probe.aborted++; },
        }) };
      };
    });
  }
});

async function prepareResult(page: Page, operation = 'merge') {
  await page.goto(`${origin}/${operation}/`);
  const input = test.info().outputPath('sample.pdf');
  const second = test.info().outputPath('second.pdf');
  await writeFile(input, source);
  await writeFile(second, source);
  await page.locator('input[type=file]').setInputFiles(operation === 'merge' ? [input, second] : input);
  await page.getByRole('button', { name: operation === 'merge' ? 'Process 2 files' : 'Process 1 file', exact: true }).click();
  await expect(page.getByTestId('save-result').first()).toBeVisible();
}

test('results wait for a tap, then save valid PDF bytes without losing the results screen', async ({ page }, testInfo) => {
  const downloads: string[] = [];
  page.on('download', download => downloads.push(download.suggestedFilename()));
  await prepareResult(page);
  const save = page.getByTestId('save-result');
  await page.screenshot({ path: testInfo.outputPath('results.png'), fullPage: true });
  expect(downloads).toEqual([]);
  if (testInfo.project.name === 'save-picker') {
    await expect(save).toHaveText('Save as…');
    expect(await page.evaluate(() => (window as any).saveProbe.calls.length)).toBe(0);
    await save.click();
    await expect(page.getByRole('region', { name: 'Save results' }).getByRole('status')).toHaveText('File saved.');
    const probe = await page.evaluate(() => (window as any).saveProbe);
    expect(probe.calls).toHaveLength(1);
    expect(probe.calls[0].active).toBe(true);
    expect(probe.calls[0].suggestedName).toMatch(/\.pdf$/);
    expect((await PDFDocument.load(new Uint8Array(probe.completed[0].bytes))).getPageCount()).toBe(6);
    expect(downloads).toEqual([]);
  } else {
    await expect(save).toHaveText('Download');
    const downloadPromise = page.waitForEvent('download');
    await save.click();
    const download = await downloadPromise;
    const destination = testInfo.outputPath('result.pdf');
    await download.saveAs(destination);
    expect((await PDFDocument.load(await readFile(destination))).getPageCount()).toBe(6);
    expect(downloads).toHaveLength(1);
  }
  await expect(save).toBeEnabled();
  expect(page.url()).toBe(`${origin}/merge/`);
});

test('split results can be saved separately with one user gesture per file', async ({ page }, testInfo) => {
  await prepareResult(page, 'split');
  const saves = page.getByTestId('save-result');
  await expect(saves).toHaveCount(3);
  const downloads: string[] = [];
  page.on('download', download => downloads.push(download.suggestedFilename()));
  for (const index of [1, 2]) {
    let bytes: Uint8Array;
    if (testInfo.project.name === 'save-picker') {
      await saves.nth(index).click();
      await expect(saves.nth(index)).toBeEnabled();
      const probe = await page.evaluate(() => (window as any).saveProbe);
      expect(probe.calls.every((call: { active: boolean }) => call.active)).toBe(true);
      expect(probe.completed).toHaveLength(index);
      bytes = new Uint8Array(probe.completed[index - 1].bytes);
    } else {
      const downloadPromise = page.waitForEvent('download');
      await saves.nth(index).click();
      const destination = testInfo.outputPath(`part-${index}.pdf`);
      await (await downloadPromise).saveAs(destination);
      bytes = await readFile(destination);
      expect(downloads).toHaveLength(index);
    }
    const pdf = await PDFDocument.load(bytes);
    expect(pdf.getPageCount()).toBe(1);
    expect(pdf.getPage(0).getWidth()).toBe(300 + index);
  }
});

test('cancel, blocked picker, and failed write retain results and allow explicit retry or fallback', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'save-picker', 'Picker-specific behavior');
  const downloads: string[] = [];
  page.on('download', download => downloads.push(download.suggestedFilename()));
  await prepareResult(page);
  const save = page.getByTestId('save-result');
  const status = page.getByRole('region', { name: 'Save results' }).getByRole('status');
  for (const mode of ['cancel', 'deny', 'write-error']) {
    await page.evaluate(mode => { (window as any).saveProbe.mode = mode; }, mode);
    await save.click();
    await expect(status).toHaveText(mode === 'cancel' ? 'Save cancelled. You can try again.' : /Could not save/);
    expect(downloads).toEqual([]);
    await expect(save).toBeEnabled();
  }
  expect(await page.evaluate(() => (window as any).saveProbe.aborted)).toBe(1);
  const fallbackDownload = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Download instead', exact: true }).click();
  await fallbackDownload;
  expect(downloads).toHaveLength(1);
  await page.evaluate(() => { (window as any).saveProbe.mode = 'save'; });
  await save.click();
  await expect(status).toHaveText('File saved.');
  expect(await page.evaluate(() => (window as any).saveProbe.completed.length)).toBe(1);
});
