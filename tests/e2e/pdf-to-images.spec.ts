import { downloadFirstResult } from '../helpers/downloads';
import { test, expect, type Page, type Download } from '@playwright/test';
import fs from 'fs';
import os from 'os';
import path from 'path';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import JSZip from 'jszip';

// Distinct page sizes (in PDF points) let us verify that each page was rendered, in order.
const PAGE_SIZES: Array<[number, number]> = [[300, 400], [500, 250]];
// Default render DPI is 144 => scale 2.
const RENDER_SCALE = 144 / 72;
const PNG_SIGNATURE = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

let fixtureDir: string;
let testFile: string;

test.beforeAll(async () => {
    fixtureDir = fs.mkdtempSync(path.join(os.tmpdir(), 'jaypdf-pdf-to-images-'));
    testFile = path.join(fixtureDir, 'two-page.pdf');
    const pdfDoc = await PDFDocument.create();
    const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    PAGE_SIZES.forEach(([width, height], index) => {
        const page = pdfDoc.addPage([width, height]);
        page.drawRectangle({ x: 20, y: 20, width: width - 40, height: height - 40, color: rgb(0.1, 0.3, 0.8) });
        page.drawText(`Page ${index + 1}`, { x: 40, y: height / 2, size: 36, font, color: rgb(1, 1, 1) });
    });
    fs.writeFileSync(testFile, await pdfDoc.save());
});

test.afterAll(() => {
    if (fixtureDir) fs.rmSync(fixtureDir, { recursive: true, force: true });
});

function readPngSize(bytes: Buffer): { width: number; height: number } {
    expect(bytes.subarray(0, 8).equals(PNG_SIGNATURE), 'file must start with the PNG signature').toBe(true);
    expect(bytes.toString('ascii', 12, 16)).toBe('IHDR');
    return { width: bytes.readUInt32BE(16), height: bytes.readUInt32BE(20) };
}

/** Decodes the PNG in the browser and returns the fraction of clearly non-white pixels. */
async function inkRatio(page: Page, bytes: Buffer): Promise<number> {
    return page.evaluate(async base64 => {
        const binary = atob(base64);
        const data = Uint8Array.from(binary, char => char.charCodeAt(0));
        const bitmap = await createImageBitmap(new Blob([data], { type: 'image/png' }));
        const canvas = new OffscreenCanvas(bitmap.width, bitmap.height);
        const context = canvas.getContext('2d')!;
        context.drawImage(bitmap, 0, 0);
        const pixels = context.getImageData(0, 0, bitmap.width, bitmap.height).data;
        let ink = 0;
        for (let i = 0; i < pixels.length; i += 4) {
            if (pixels[i] < 200 || pixels[i + 1] < 200 || pixels[i + 2] < 200) ink += 1;
        }
        return ink / (pixels.length / 4);
    }, bytes.toString('base64'));
}

async function expectValidPageImages(page: Page, images: Buffer[]): Promise<void> {
    expect(images).toHaveLength(PAGE_SIZES.length);
    for (const [index, bytes] of images.entries()) {
        const [width, height] = PAGE_SIZES[index];
        expect(readPngSize(bytes)).toEqual({
            width: Math.ceil(width * RENDER_SCALE),
            height: Math.ceil(height * RENDER_SCALE),
        });
        // The blue rectangle covers most of each page; a blank or failed render would be ~0.
        expect(await inkRatio(page, bytes)).toBeGreaterThan(0.5);
    }
}

async function readDownload(download: Download): Promise<Buffer> {
    const downloadPath = await download.path();
    expect(downloadPath).toBeTruthy();
    return fs.readFileSync(downloadPath!);
}

async function uploadTwoPagePdf(page: Page): Promise<void> {
    await page.goto('/pdf-to-images', { timeout: 60_000 });
    await expect(page.getByRole('heading', { name: 'Convert PDF pages to PNG or JPEG' })).toBeVisible();
    await page.locator('input[type="file"]').setInputFiles(testFile);
    await expect(page.getByText(path.basename(testFile)).first()).toBeVisible();
}

test('PDF to Images saves a ZIP with one valid PNG per page', async ({ page }) => {
    test.setTimeout(120_000);
    const pageErrors: string[] = [];
    page.on('pageerror', error => pageErrors.push(error.message));

    await uploadTwoPagePdf(page);
    // Default options: PNG bundled into a ZIP.
    await expect(page.getByRole('checkbox', { name: /Bundle images in a ZIP/ })).toBeChecked();

    await page.getByRole('button', { name: 'Export images' }).click();
    const downloadPromise = page.waitForEvent('download');
    await downloadFirstResult(page);
    const download = await downloadPromise;

    expect(download.suggestedFilename()).toMatch(/^two-page_.*\.zip$/);
    const zip = await JSZip.loadAsync(await readDownload(download));
    const names = Object.keys(zip.files).filter(name => !zip.files[name].dir).sort();
    expect(names).toHaveLength(2);
    names.forEach(name => expect(name).toMatch(/_1\.png$|_2\.png$/));

    const images = await Promise.all(names.map(name => zip.files[name].async('nodebuffer')));
    await expectValidPageImages(page, images);
    expect(pageErrors).toEqual([]);
});

test('PDF to Images saves each page as a separate valid PNG when ZIP is off', async ({ page }) => {
    test.setTimeout(120_000);
    await page.addInitScript(() => {
        const scope = window as Window & { savedFiles?: Array<{ suggestedName: string; bytes: number[] }> };
        scope.savedFiles = [];
        (scope as unknown as { showSaveFilePicker: unknown }).showSaveFilePicker = async (
            { suggestedName }: { suggestedName: string },
        ) => {
            let bytes: number[] = [];
            return {
                createWritable: async () => ({
                    write: async (blob: Blob) => {
                        if (!(blob instanceof Blob)) throw new TypeError('Expected a Blob');
                        bytes = [...new Uint8Array(await blob.arrayBuffer())];
                    },
                    close: async () => {
                        scope.savedFiles!.push({ suggestedName, bytes });
                    },
                    abort: async () => {},
                }),
            };
        };
    });

    await uploadTwoPagePdf(page);
    await page.getByRole('checkbox', { name: /Bundle images in a ZIP/ }).uncheck();

    await page.getByRole('button', { name: 'Export images' }).click();
    const saveButtons = page.getByTestId('save-result');
    await expect(saveButtons).toHaveCount(2, { timeout: 60_000 });

    const downloadedImages: Buffer[] = [];
    for (let index = 0; index < 2; index += 1) {
        await saveButtons.nth(index).click();
        await expect(
            page.getByRole('region', { name: 'Save results' }).getByRole('status').nth(index),
        ).toHaveText('File saved.');

        const fallback = page.getByRole('button', { name: 'Download instead', exact: true }).nth(index);
        const downloadPromise = page.waitForEvent('download');
        await fallback.click();
        const download = await downloadPromise;
        expect(download.suggestedFilename()).toMatch(new RegExp(`_${index + 1}\\.png$`));
        downloadedImages.push(await readDownload(download));
    }

    const pickerSaved = await page.evaluate(
        () => (window as Window & { savedFiles?: Array<{ suggestedName: string; bytes: number[] }> }).savedFiles ?? [],
    );
    expect(pickerSaved).toHaveLength(2);
    await expectValidPageImages(
        page,
        pickerSaved.map(entry => Buffer.from(entry.bytes)),
    );
    await expectValidPageImages(page, downloadedImages);
});

