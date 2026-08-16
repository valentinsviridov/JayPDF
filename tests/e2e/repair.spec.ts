import { test, expect } from '@playwright/test';
import * as path from 'path';
import * as fs from 'fs';
import { fileURLToPath } from 'url';
import { PDFDocument } from 'pdf-lib';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

test.describe('PDF Repair Operation', () => {
  test('recovers and repairs corrupted PDF (cg-brsvie.pdf) into a valid document', async ({ page }) => {
    test.setTimeout(240_000);
    const corruptPdfPath = path.join(__dirname, 'fixtures', 'cg-brsvie.pdf');

    // 1. Visit Repair Page
    await page.goto('/repair', { timeout: 60_000 });

    // 2. Upload the corrupted PDF
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles(corruptPdfPath);

    // 3. Verify file appears in list
    await expect(page.getByText('cg-brsvie.pdf').first()).toBeVisible({ timeout: 20_000 });

    // 4. Set up download listener and trigger processing
    const downloadPromise = page.waitForEvent('download', { timeout: 180_000 });
    const processButton = page.getByRole('button', { name: /^Process \d+ file/ });
    await expect(processButton).toBeEnabled({ timeout: 20_000 });
    await processButton.click();

    // 5. Wait for download
    const download = await downloadPromise;
    const downloadPath = path.join(__dirname, 'fixtures', `repaired_test_${Date.now()}.pdf`);
    await download.saveAs(downloadPath);

    // 6. Verify the repaired file exists and can be loaded with pdf-lib
    expect(fs.existsSync(downloadPath)).toBeTruthy();
    const repairedBytes = fs.readFileSync(downloadPath);
    expect(repairedBytes.length).toBeGreaterThan(0);

    const doc = await PDFDocument.load(repairedBytes);
    expect(doc.getPageCount()).toBe(75);

    // Clean up
    fs.unlinkSync(downloadPath);
  });
});
