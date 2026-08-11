import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import { PDFDocument } from 'pdf-lib';

const testPdfPath1 = path.join(process.cwd(), 'ui-test-1.pdf');
const testPdfPath2 = path.join(process.cwd(), 'ui-test-2.pdf');

test.beforeAll(async () => {
    // Create first PDF
    const pdfDoc1 = await PDFDocument.create();
    const page1 = pdfDoc1.addPage();
    page1.drawText('Test File 1 Content');
    fs.writeFileSync(testPdfPath1, await pdfDoc1.save());

    // Create second PDF
    const pdfDoc2 = await PDFDocument.create();
    const page2 = pdfDoc2.addPage();
    page2.drawText('Test File 2 Content');
    fs.writeFileSync(testPdfPath2, await pdfDoc2.save());
});

test.afterAll(() => {
    if (fs.existsSync(testPdfPath1)) fs.unlinkSync(testPdfPath1);
    if (fs.existsSync(testPdfPath2)) fs.unlinkSync(testPdfPath2);
});

test.describe('UI Refinements', () => {
    test('should show Total Savings summary and support Clear All', async ({ page }) => {
        test.setTimeout(120_000);

        // 1. Navigate to English compress page
        await page.goto('/compress');

        // 2. Upload 2 files
        const fileInput = page.locator('input[type="file"]');
        await fileInput.setInputFiles([testPdfPath1, testPdfPath2]);

        // 3. Verify files are listed (use getByTitle to avoid strict mode)
        await expect(page.getByTitle('ui-test-1.pdf')).toBeVisible();
        await expect(page.getByTitle('ui-test-2.pdf')).toBeVisible();

        // 4. Verify "Clear all" button is visible
        // Two buttons share this label (file list + results); grab the first one
        const clearAllButton = page.getByRole('button', { name: /Clear all/i }).first();
        await expect(clearAllButton).toBeVisible();

        // 5. Process 2 files — click the process button
        const processButton = page.getByRole('button', { name: /Process 2 files/i });
        await processButton.click();

        // 6. Wait for processing to finish — look for "Success!" inline result screen
        await expect(page.getByText('Success!')).toBeVisible({ timeout: 60_000 });
        await expect(page.getByText(/Your files have been processed locally/i)).toBeVisible();

        // 7. Verify the download button exists
        const downloadButton = page.getByRole('button', { name: /Download Result/i });
        await expect(downloadButton).toBeVisible();

        // 8. Clear All — click "Process More Files" button which acts as clear
        const processMoreButton = page.getByRole('button', { name: /Process More Files/i });
        await processMoreButton.click({ force: true });

        // 9. Verify list is empty
        await expect(page.getByTitle('ui-test-1.pdf')).not.toBeVisible();
        // Check for empty state (upload prompt)
        await expect(page.getByText(/Click to select/i)).toBeVisible();
    });
});
