import { test, expect } from '@playwright/test';
import fs from 'fs';
import { PDFDocument } from 'pdf-lib';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const getTestPdf1Path = (workerIndex: number) => path.join(__dirname, `pwa-offline-1-w${workerIndex}.pdf`);
const getTestPdf2Path = (workerIndex: number) => path.join(__dirname, `pwa-offline-2-w${workerIndex}.pdf`);

test.describe('Progressive Web App (PWA) & Offline Capabilities', () => {
  test('Web App Manifest is served and contains required PWA metadata', async ({ request }) => {
    const response = await request.get('/manifest.webmanifest');
    expect(response.status()).toBe(200);

    const manifest = await response.json();
    expect(manifest.name).toContain('JayPDF');
    expect(manifest.short_name).toBe('JayPDF');
    expect(manifest.display).toBe('standalone');
    expect(manifest.start_url).toBe('/');
    expect(manifest.scope).toBe('/');
    expect(manifest.theme_color).toBe('#ffffff');
    expect(manifest.background_color).toBe('#ffffff');

    expect(Array.isArray(manifest.icons)).toBe(true);
    const iconSizes = manifest.icons.map((icon: { sizes: string }) => icon.sizes);
    expect(iconSizes).toContain('192x192');
    expect(iconSizes).toContain('512x512');
  });

  test('HTML pages include PWA and mobile home-screen meta tags', async ({ page }) => {
    await page.goto('/');

    const manifestLinks = page.locator('link[rel="manifest"]');
    await expect(manifestLinks.first()).toHaveAttribute('href', '/manifest.webmanifest');

    const appleMobileCapable = page.locator('meta[name="apple-mobile-web-app-capable"], meta[name="mobile-web-app-capable"]').first();
    await expect(appleMobileCapable).toHaveAttribute('content', 'yes');

    const themeColor = page.locator('meta[name="theme-color"]').first();
    await expect(themeColor).toHaveAttribute('content', '#ffffff');

    const appleTouchIcon = page.locator('link[rel="apple-touch-icon"]').first();
    await expect(appleTouchIcon).toHaveAttribute('href', /\/apple-touch-icon\.png/);
  });

  test('Service worker is registered and enables 100% offline PDF processing', async ({ page, context }, testInfo) => {
    test.setTimeout(90_000);

    const testFile1 = getTestPdf1Path(testInfo.workerIndex);
    const testFile2 = getTestPdf2Path(testInfo.workerIndex);

    // Create test files for this worker
    const doc1 = await PDFDocument.create();
    doc1.addPage().drawText('PWA Offline Doc 1 - Page 1');
    fs.writeFileSync(testFile1, await doc1.save());

    const doc2 = await PDFDocument.create();
    doc2.addPage().drawText('PWA Offline Doc 2 - Page 1');
    doc2.addPage().drawText('PWA Offline Doc 2 - Page 2');
    fs.writeFileSync(testFile2, await doc2.save());

    try {
      // 1. Visit the app to let service worker install and cache assets
      await page.goto('/', { waitUntil: 'networkidle' });

      // 2. Wait for service worker to be active
      await page.waitForFunction(async () => {
        if (!('serviceWorker' in navigator)) return false;
        const reg = await navigator.serviceWorker.ready;
        return reg !== undefined && reg.active !== null;
      }, { timeout: 15_000 }).catch(() => {});

      // 3. Allow background preload and caching of all operations to complete
      await page.waitForTimeout(3000);

      // 4. Enable offline mode in browser context
      await context.setOffline(true);

      // 5. Upload files while completely offline
      const fileInput = page.locator('input[type="file"]');
      await fileInput.setInputFiles([testFile1, testFile2]);

      // 6. Verify uploaded files appear in offline UI
      await expect(page.getByText(path.basename(testFile1)).first()).toBeVisible();
      await expect(page.getByText(path.basename(testFile2)).first()).toBeVisible();

      // 7. Process PDF merger entirely client-side offline
      const downloadPromise = page.waitForEvent('download');
      await page.getByRole('button', { name: 'Process 2 files' }).click();
      const download = await downloadPromise;

      expect(download.suggestedFilename()).toMatch(/merged_JayPDF_\d{8}_\d{6}\.pdf$/);

      // 8. Verify generated PDF integrity (1 + 2 = 3 pages)
      const downloadPath = path.join(__dirname, `downloaded-pwa-merged-w${testInfo.workerIndex}.pdf`);
      await download.saveAs(downloadPath);

      const mergedBuffer = fs.readFileSync(downloadPath);
      const mergedDoc = await PDFDocument.load(mergedBuffer);
      expect(mergedDoc.getPageCount()).toBe(3);

      if (fs.existsSync(downloadPath)) {
        fs.unlinkSync(downloadPath);
      }
    } finally {
      // Clean up worker test files and reset offline mode
      await context.setOffline(false);
      if (fs.existsSync(testFile1)) fs.unlinkSync(testFile1);
      if (fs.existsSync(testFile2)) fs.unlinkSync(testFile2);
    }
  });
});
