import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import { PDFDocument } from 'pdf-lib';

const getTestPdfPath1 = (workerIndex: number) => path.join(process.cwd(), `ui-test-1-${workerIndex}.pdf`);
const getTestPdfPath2 = (workerIndex: number) => path.join(process.cwd(), `ui-test-2-${workerIndex}.pdf`);

test.beforeAll(async ({}, testInfo) => {
    // Create first PDF
    const pdfDoc1 = await PDFDocument.create();
    const page1 = pdfDoc1.addPage();
    page1.drawText('Test File 1 Content');
    fs.writeFileSync(getTestPdfPath1(testInfo.workerIndex), await pdfDoc1.save());

    // Create second PDF
    const pdfDoc2 = await PDFDocument.create();
    const page2 = pdfDoc2.addPage();
    page2.drawText('Test File 2 Content');
    fs.writeFileSync(getTestPdfPath2(testInfo.workerIndex), await pdfDoc2.save());
});

test.afterAll(({}, testInfo) => {
    const f1 = getTestPdfPath1(testInfo.workerIndex);
    const f2 = getTestPdfPath2(testInfo.workerIndex);
    if (fs.existsSync(f1)) fs.unlinkSync(f1);
    if (fs.existsSync(f2)) fs.unlinkSync(f2);
});

test.describe('UI Refinements', () => {
    test('should show Total Savings summary and support Clear All', async ({ page }, testInfo) => {
        test.setTimeout(120_000);
        const file1 = getTestPdfPath1(testInfo.workerIndex);
        const file2 = getTestPdfPath2(testInfo.workerIndex);
        const name1 = path.basename(file1);
        const name2 = path.basename(file2);

        // 1. Navigate to English compress page
        await page.goto('/compress');

        // 2. Upload 2 files
        const fileInput = page.locator('input[type="file"]');
        await fileInput.setInputFiles([file1, file2]);

        // 3. Verify files are listed (use getByTitle to avoid strict mode)
        await expect(page.getByTitle(name1)).toBeVisible();
        await expect(page.getByTitle(name2)).toBeVisible();

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
        await expect(page.getByTitle(name1)).not.toBeVisible();
        // Check for empty state (upload prompt)
        await expect(page.getByText(/Click to select/i)).toBeVisible();
    });

    test('should show complete tool names without ellipsis on narrow mobile screen', async ({ page }) => {
        // Set mobile viewport (iPhone SE / narrow screen)
        await page.setViewportSize({ width: 375, height: 667 });
        await page.goto('/');

        // Get all tool mode buttons in the tool switcher
        const toolButtons = page.locator('#pdf-processor .grid button span');
        const count = await toolButtons.count();
        expect(count).toBeGreaterThan(0);

        for (let i = 0; i < count; i++) {
            const spanText = await toolButtons.nth(i).textContent();
            expect(spanText).toBeTruthy();
            // Verify tool names are not cut off with an ellipsis
            expect(spanText).not.toContain('...');
            expect(spanText).not.toContain('…');
        }
    });

    test('should wrap long PDF filenames cleanly on mobile without exceeding container width', async ({ page }, testInfo) => {
        // Set narrow mobile viewport
        await page.setViewportSize({ width: 360, height: 640 });
        await page.goto('/compress');

        const longNamePdfPath = path.join(process.cwd(), `very_long_finance_audit_report_2026_fourth_quarter_final_approved_document_${testInfo.workerIndex}.pdf`);
        try {
            const pdfDoc = await PDFDocument.create();
            pdfDoc.addPage().drawText('Long Filename Content');
            fs.writeFileSync(longNamePdfPath, await pdfDoc.save());

            const fileInput = page.locator('input[type="file"]');
            await fileInput.setInputFiles([longNamePdfPath]);

            // Verify the long filename is visible in the file list
            const previewName = page.locator('.pdf-preview-name');
            await expect(previewName).toBeVisible();

            // Verify the file item container does not exceed page viewport width (no horizontal overflow)
            const hasHorizontalScrollbar = await page.evaluate(() => {
                return document.documentElement.scrollWidth > window.innerWidth + 2;
            });
            expect(hasHorizontalScrollbar).toBe(false);
        } finally {
            if (fs.existsSync(longNamePdfPath)) fs.unlinkSync(longNamePdfPath);
        }
    });
});

