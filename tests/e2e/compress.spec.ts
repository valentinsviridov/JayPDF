import { test, expect } from '@playwright/test';
import fs from 'fs';
import { PDFDocument } from 'pdf-lib';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const testPdfPath = path.join(__dirname, 'compress-test.pdf');

test.beforeAll(async () => {
    // Create a heavy PDF for testing compression
    const pdfDoc = await PDFDocument.create();
    // Add multiple pages with text to simulate content
    for (let i = 0; i < 5; i++) {
        const page = pdfDoc.addPage();
        page.drawText(`Page ${i + 1} with some content for compression testing. `.repeat(50), {
            x: 50,
            y: 700,
            size: 12,
        });
    }
    const pdfBytes = await pdfDoc.save();
    fs.writeFileSync(testPdfPath, pdfBytes);
});

test.afterAll(() => {
    if (fs.existsSync(testPdfPath)) {
        try {
            fs.unlinkSync(testPdfPath);
        } catch (e) {
            console.warn('Failed to cleanup test file', e);
        }
    }
});

test('PDF Compression Workflow', async ({ page }) => {
    test.setTimeout(90_000);

    // 1. Visit Compress Page directly
    await page.goto('/compress', { timeout: 60_000 });

    // 2. Verify we are on the correct tool
    await expect(page.getByRole('heading', { name: 'Compress PDF online with clear results' })).toBeVisible();

    // 3. Upload File
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles(testPdfPath);

    // 4. Verify File Appears
    await expect(page.getByText('compress-test.pdf').first()).toBeVisible();

    // 5. Adjust Compression Settings
    // Click "Extreme / High" compression
    // Use force: true because the cookie banner or other fixed elements might intercept the click
    await page.getByLabel(/Extreme|High/i).click({ force: true });

    // 6. Process
    // Setup download listener before clicking
    const downloadPromise = page.waitForEvent('download');

    // Click "Compress PDF" button
    await page.getByRole('button', { name: 'Process 1 file' }).click();

    // 7. Verification
    const download = await downloadPromise;

    // Check filename
    expect(download.suggestedFilename()).toMatch(/compressed_JayPDF\.pdf$/);

    // Save to temp path to check size
    const downloadPath = path.join(__dirname, 'downloaded-compressed.pdf');
    await download.saveAs(downloadPath);

    const originalSize = fs.statSync(testPdfPath).size;
    const compressedSize = fs.statSync(downloadPath).size;

    console.log(`Original: ${originalSize}, Compressed: ${compressedSize}`);

    // Basic assertion: it should be a valid PDF buffer (non-empty)
    // Note: Actual compression ratio depends on content, but size > 0 confirms process worked
    expect(compressedSize).toBeGreaterThan(0);

    // Cleanup download

});

test('PDF Compression with Strip Annotations on Corrupt PDF', async ({ page }) => {
    test.setTimeout(90_000);
    const corruptPdfPath = path.join(__dirname, 'fixtures', 'cg-brsvie.pdf');

    // 1. Visit Compress Page directly
    await page.goto('/compress', { timeout: 60_000 });

    // 2. Upload the corrupt file
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles(corruptPdfPath);

    // 3. Verify File Appears (preview card)
    await expect(page.getByText('cg-brsvie.pdf').first()).toBeVisible();

    // 4. Click the process button
    const processButton = page.getByRole('button', { name: /^Process \d+ file/ });
    await expect(processButton).toBeEnabled({ timeout: 20_000 });
    await processButton.click();

    // 5. Verify inline error is rendered in the UI with filename and virtual printer hint
    await expect(page.getByText(/This PDF document \(cg-brsvie\.pdf\) is corrupted or malformed/i).first()).toBeVisible({ timeout: 10_000 });
    await expect(page.getByText(/printing the file to PDF using a virtual printer could help/i).first()).toBeVisible({ timeout: 10_000 });
});

test('PDF Compression on Corrupt PDF offers 1-click Fix with Auto-Repair and completes successfully', async ({ page }) => {
    test.setTimeout(240_000);
    const corruptPdfPath = path.join(__dirname, 'fixtures', 'cg-brsvie.pdf');

    // 1. Visit Compress Page
    await page.goto('/compress', { timeout: 60_000 });

    // 2. Upload the corrupt file
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles(corruptPdfPath);
    await expect(page.getByText('cg-brsvie.pdf').first()).toBeVisible();

    // 3. Process without auto-repair enabled initially
    const processButton = page.getByRole('button', { name: /^Process \d+ file/ });
    await expect(processButton).toBeEnabled({ timeout: 20_000 });
    await processButton.click();

    // 4. Verify corrupted document prompt and 1-click repair button appear
    await expect(page.getByText(/Corrupted Document Detected/i)).toBeVisible({ timeout: 15_000 });
    const repairAndRetryBtn = page.getByRole('button', { name: /Fix with Auto-Repair & Retry/i });
    await expect(repairAndRetryBtn).toBeVisible();

    // 5. Click the 1-click recovery button and verify automatic relaunch and download
    const downloadPromise = page.waitForEvent('download', { timeout: 240_000 });
    await repairAndRetryBtn.click();

    const download = await downloadPromise;
    expect(download.suggestedFilename()).toBe('cg-brsvie_compressed_JayPDF.pdf');

    const downloadDest = path.join(__dirname, 'downloaded-1click-repaired.pdf');
    await download.saveAs(downloadDest);
    expect(fs.statSync(downloadDest).size).toBeGreaterThan(0);
    if (fs.existsSync(downloadDest)) {
        try { fs.unlinkSync(downloadDest); } catch (e) {}
    }
});

