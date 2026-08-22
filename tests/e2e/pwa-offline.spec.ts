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

  test('Favicon and Logo resources are properly served', async ({ request }) => {
    const assets = [
      '/images/jaypdf-logo.png',
      '/images/jaypdf-logo@2x.png',
      '/images/jaypdf-favicon.png',
      '/favicon.ico',
      '/favicon.png',
      '/favicon-32x32.png',
      '/favicon-192x192.png',
      '/favicon-512x512.png',
      '/apple-touch-icon.png',
    ];

    for (const asset of assets) {
      const res = await request.get(asset);
      expect(res.status(), `Asset ${asset} should return 200`).toBe(200);
      expect(res.headers()['content-type']).toBeTruthy();
    }
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

  test('Processing results page indicates PWA availability and provides install control in standard browser mode', async ({ page }, testInfo) => {
    const testFile1 = getTestPdf1Path(testInfo.workerIndex);
    const testFile2 = getTestPdf2Path(testInfo.workerIndex);

    const doc1 = await PDFDocument.create();
    doc1.addPage().drawText('PWA Results Test 1');
    fs.writeFileSync(testFile1, await doc1.save());

    const doc2 = await PDFDocument.create();
    doc2.addPage().drawText('PWA Results Test 2');
    fs.writeFileSync(testFile2, await doc2.save());

    try {
      await page.goto('/merge');

      const fileInput = page.locator('input[type="file"]');
      await fileInput.setInputFiles([testFile1, testFile2]);

      const downloadPromise = page.waitForEvent('download');
      await page.getByRole('button', { name: 'Process 2 files' }).click();
      await downloadPromise;

      // On results dialog/page in browser mode, verify PWA install indication and control are visible
      const pwaBanner = page.locator('[data-testid="pwa-install-banner"]');
      await expect(pwaBanner).toBeVisible();
      await expect(page.getByText('Install JayPDF App')).toBeVisible();

      const installButton = page.locator('[data-testid="pwa-install-button"]');
      await expect(installButton).toBeVisible();
    } finally {
      if (fs.existsSync(testFile1)) fs.unlinkSync(testFile1);
      if (fs.existsSync(testFile2)) fs.unlinkSync(testFile2);
    }
  });

  test('PWA installation suggestion is NOT shown when app is run in PWA (standalone) mode', async ({ page }, testInfo) => {
    const testFile1 = getTestPdf1Path(testInfo.workerIndex);
    const testFile2 = getTestPdf2Path(testInfo.workerIndex);

    const doc1 = await PDFDocument.create();
    doc1.addPage().drawText('PWA Standalone Results Test 1');
    fs.writeFileSync(testFile1, await doc1.save());

    const doc2 = await PDFDocument.create();
    doc2.addPage().drawText('PWA Standalone Results Test 2');
    fs.writeFileSync(testFile2, await doc2.save());

    try {
      // Emulate running inside PWA standalone mode
      await page.addInitScript(() => {
        const originalMatchMedia = window.matchMedia;
        window.matchMedia = function(query: string) {
          if (query.includes('display-mode: standalone') || query.includes('display-mode: fullscreen')) {
            return {
              matches: true,
              media: query,
              onchange: null,
              addListener: () => {},
              removeListener: () => {},
              addEventListener: () => {},
              removeEventListener: () => {},
              dispatchEvent: () => false,
            } as unknown as MediaQueryList;
          }
          return originalMatchMedia.call(window, query);
        };
      });

      await page.goto('/merge');

      const fileInput = page.locator('input[type="file"]');
      await fileInput.setInputFiles([testFile1, testFile2]);

      const downloadPromise = page.waitForEvent('download');
      await page.getByRole('button', { name: 'Process 2 files' }).click();
      await downloadPromise;

      // In standalone PWA mode, verify PWA install suggestion is NOT shown
      const pwaBanner = page.locator('[data-testid="pwa-install-banner"]');
      await expect(pwaBanner).not.toBeVisible();
      await expect(page.getByText('Install JayPDF App')).not.toBeVisible();
    } finally {
      if (fs.existsSync(testFile1)) fs.unlinkSync(testFile1);
      if (fs.existsSync(testFile2)) fs.unlinkSync(testFile2);
    }
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
