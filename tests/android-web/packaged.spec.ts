import { test, expect } from '@playwright/test';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { PDFDocument } from 'pdf-lib';
import JSZip from 'jszip';

const origin = 'https://appassets.androidplatform.net';
const root = path.resolve('android/app/src/main/assets/web');
const csp = "default-src 'none'; script-src 'self' 'unsafe-inline' 'wasm-unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' blob: data:; font-src 'self' data:; connect-src 'self' blob:; worker-src 'self' blob:; frame-src 'none'; object-src 'none'; base-uri 'none'; form-action 'none'";

test('packaged Android UI merges and renders PDFs with only local assets and native exports', async ({ context, page }) => {
  const unexpected: string[] = [];
  const missing: string[] = [];
  const errors: string[] = [];
  const workerUrls: string[] = [];
  const exports: { fileName: string; chunks: Buffer[] }[] = [];
  let active: { fileName: string; chunks: Buffer[] };
  page.on('pageerror', error => errors.push(error.message));
  page.on('worker', worker => workerUrls.push(worker.url()));
  page.on('download', () => unexpected.push('Browser download used instead of Android export'));
  await context.route('**/*', async route => {
    const url = new URL(route.request().url());
    if (url.origin !== origin) {
      unexpected.push(url.href);
      return route.abort();
    }
    const pathname = decodeURIComponent(url.pathname);
    const file = path.join(root, pathname.endsWith('/') ? `${pathname}index.html` : pathname);
    const mime: Record<string, string> = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.txt': 'text/plain', '.wasm': 'application/wasm', '.woff2': 'font/woff2', '.png': 'image/png' };
    try {
      await route.fulfill({ body: await readFile(file), contentType: mime[path.extname(file)] || 'application/octet-stream', headers: { 'Content-Security-Policy': csp, 'X-Content-Type-Options': 'nosniff' } });
    } catch {
      missing.push(pathname);
      await route.fulfill({ status: 404, body: '' });
    }
  });
  await page.exposeFunction('nativeDocumentMessage', (raw: string) => {
    const message = JSON.parse(raw);
    if (message.action === 'begin') active = { fileName: message.fileName, chunks: [] };
    if (message.action === 'chunk') active.chunks.push(Buffer.from(message.data, 'base64'));
    if (message.action === 'finish') exports.push(active);
    return JSON.stringify({ id: message.id });
  });
  await page.addInitScript(() => {
    const nativeWindow = window as any;
    nativeWindow.JayPdfDocuments = {
      onmessage: null,
      postMessage(message: string) {
        void nativeWindow.nativeDocumentMessage(message).then((data: string) => nativeWindow.JayPdfDocuments.onmessage?.({ data }));
      },
    };
  });
  const pdf = await PDFDocument.create();
  pdf.addPage().drawText('Private Android test document');
  const file = { name: 'sample.pdf', mimeType: 'application/pdf', buffer: Buffer.from(await pdf.save()) };

  await page.goto(origin + '/merge/');
  await page.locator('input[type="file"]').setInputFiles([file, { ...file, name: 'second.pdf' }]);
  await page.getByRole('button', { name: 'Process 2 files' }).click();
  await expect(page.getByTestId('save-result')).toBeVisible();
  expect(exports).toHaveLength(0);
  await page.getByRole('button', { name: 'Save as…', exact: true }).click();
  await expect.poll(() => exports.length).toBe(1);
  expect((await PDFDocument.load(Buffer.concat(exports[0].chunks))).getPageCount()).toBe(2);
  await expect(page.getByRole('region', { name: 'Save results' }).getByRole('status')).toHaveText('File saved.');

  await page.goto(origin + '/pdf-to-images/');
  await page.locator('input[type="file"]').setInputFiles(file);
  await page.getByRole('button', { name: 'Export images' }).click();
  await expect(page.getByTestId('save-result')).toBeVisible();
  expect(exports).toHaveLength(1);
  await page.getByRole('button', { name: 'Save as…', exact: true }).click();
  await expect.poll(() => exports.length, { timeout: 30_000 }).toBe(2);
  const zip = await JSZip.loadAsync(Buffer.concat(exports[1].chunks));
  const images = Object.values(zip.files).filter(entry => !entry.dir);
  expect(images).toHaveLength(1);
  expect((await images[0].async('uint8array')).slice(0, 8)).toEqual(new Uint8Array([137, 80, 78, 71, 13, 10, 26, 10]));

  await page.getByRole('link', { name: 'Privacy', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'JayPDF Privacy Policy', exact: true })).toBeVisible();
  await page.getByRole('link', { name: 'Licenses', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Licenses and source code', exact: true })).toBeVisible();
  expect(await page.evaluate(() => navigator.serviceWorker.getRegistrations().then(registrations => registrations.length))).toBe(0);
  expect(workerUrls.some(url => url.includes('/_next/'))).toBe(true);
  expect(missing).toEqual([]);
  expect(unexpected).toEqual([]);
  expect(errors).toEqual([]);
});
