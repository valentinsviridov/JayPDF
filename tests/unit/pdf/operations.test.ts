import { describe, expect, test } from 'bun:test';
import { deflateSync } from 'node:zlib';
import { PDFDocument } from 'pdf-lib';
import { compressPdf } from '../../../src/modules/pdf/operations/compress';
import { decompressFlateStream } from '../../../src/modules/pdf/operations/compress/enhancements';
import { cropPdfPages } from '../../../src/modules/pdf/operations/crop';
import { extractPdfPages } from '../../../src/modules/pdf/operations/extract';
import { imagesToPdf } from '../../../src/modules/pdf/operations/images-to-pdf';
import { mergePdfs } from '../../../src/modules/pdf/operations/merge';
import { reorderPdfPages } from '../../../src/modules/pdf/operations/reorder';
import { normalizeRotation, rotatePdfPages } from '../../../src/modules/pdf/operations/rotate';
import { splitPdf } from '../../../src/modules/pdf/operations/split';
import { sanitizeImageBaseName } from '../../../src/modules/pdf/operations/pdf-to-images';
import { createPdfBytes, namedSource, ONE_PIXEL_PNG } from './fixtures';

async function pageWidths(bytes: Uint8Array): Promise<number[]> {
  const pdf = await PDFDocument.load(bytes);
  return pdf.getPages().map(page => page.getWidth());
}

describe('independent PDF operation modules', () => {
  test('merge preserves source page order, metadata, and optional dividers', async () => {
    const first = await createPdfBytes([101], { title: 'first' });
    const second = await createPdfBytes([202, 203]);
    const result = await mergePdfs([first, second], {
      addPageDividers: true,
      metadata: { title: 'merged title', author: 'PDFLince' },
    });
    const pdf = await PDFDocument.load(result);
    expect(pdf.getPageCount()).toBe(4);
    expect(pdf.getPage(0).getWidth()).toBeCloseTo(101);
    expect(pdf.getPage(2).getWidth()).toBeCloseTo(202);
    expect(pdf.getTitle()).toBe('merged title');
    expect(pdf.getAuthor()).toBe('PDFLince');
  });

  test('split creates deterministic page chunks and validates chunk size', async () => {
    const source = await createPdfBytes([101, 102, 103, 104, 105]);
    const parts = await splitPdf([source], { pagesPerFile: 2 });
    expect(parts).toHaveLength(3);
    expect(await pageWidths(parts[0])).toEqual([101, 102]);
    expect(await pageWidths(parts[1])).toEqual([103, 104]);
    expect(await pageWidths(parts[2])).toEqual([105]);
    await expect(splitPdf([source], { pagesPerFile: 0 })).rejects.toThrow(/positive integer/);
  });

  test('extract keeps its documented sorted-page policy', async () => {
    const source = await createPdfBytes([101, 102, 103]);
    const result = await extractPdfPages([source], {
      pagesToExtract: [3, 1],
      preserveMetadata: false,
    });
    expect(await pageWidths(result)).toEqual([101, 103]);
  });

  test('reorder preserves caller order and supports explicit duplication', async () => {
    const source = await createPdfBytes([101, 102, 103]);
    const result = await reorderPdfPages([source], { pageOrder: [3, 1, 3] });
    expect(await pageWidths(result)).toEqual([103, 101, 103]);
  });

  test('crop maps visual margins through existing page rotation', async () => {
    const source = await createPdfBytes([400], { rotation: 90 });
    const result = await cropPdfPages([source], {
      pagesToCrop: [1],
      cropMargins: { top: 10, right: 20, bottom: 30, left: 40 },
    });
    const page = (await PDFDocument.load(result)).getPage(0);
    const box = page.getMediaBox();
    expect(box.x).toBeCloseTo(10);
    expect(box.y).toBeCloseTo(40);
    expect(box.width).toBeCloseTo(360);
    expect(box.height).toBeCloseTo(140);
  });

  test('rotate composes signed quarter turns with existing rotation', async () => {
    expect(normalizeRotation(-90)).toBe(270);
    const source = await createPdfBytes([101, 102], { rotation: 90 });
    const result = await rotatePdfPages([source], {
      pagesToRotate: [1],
      rotationDegrees: -90,
    });
    const pdf = await PDFDocument.load(result);
    expect(pdf.getPage(0).getRotation().angle).toBe(0);
    expect(pdf.getPage(1).getRotation().angle).toBe(90);
  });

  test('compression exposes consistent metrics without browser-only image work', async () => {
    const source = await createPdfBytes([101, 102]);
    const result = await compressPdf([source], {
      compressionLevel: 'low',
      preserveMetadata: true,
      stripAnnotations: false,
      downscaleImages: false,
    });
    expect(result.originalSize).toBe(source.byteLength);
    expect(result.processedSize).toBe(result.data.byteLength);
    expect(result.compressionRatio).toBeCloseTo(result.processedSize / result.originalSize, 8);
    expect(result.processingTimeMs).toBeGreaterThan(0);
    expect((await PDFDocument.load(result.data)).getPageCount()).toBe(2);
  });

  test('compression drains large Flate streams without backpressure deadlock', async () => {
    const original = new Uint8Array(2 * 1024 * 1024);
    let state = 0x5eed1234;
    for (let index = 0; index < original.length; index += 1) {
      state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
      original[index] = state >>> 24;
    }
    const compressed = new Uint8Array(deflateSync(original));
    const result = await decompressFlateStream(compressed);
    expect(result).toEqual(original);
  });

  test('images-to-PDF accepts byte-oriented named PNG sources', async () => {
    const source = namedSource('pixel.png', 'image/png', ONE_PIXEL_PNG);
    const result = await imagesToPdf([source, source], { pageSize: 'auto' });
    const pdf = await PDFDocument.load(result);
    expect(pdf.getPageCount()).toBe(2);
    expect(pdf.getPage(0).getWidth()).toBeCloseTo(1);
  });

  test('PDF-to-images filename policy is pure and directly testable', () => {
    expect(sanitizeImageBaseName('  Quarterly Résumé / 2026  ')).toBe('quarterly-résumé-2026');
    expect(sanitizeImageBaseName('***')).toBe('pdflince');
  });
});
