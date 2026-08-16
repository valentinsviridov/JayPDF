import { PDFDocument, rgb } from 'pdf-lib';
import type { BinaryInput, PdfOperationModule, ProgressCallback } from '../../core/contracts';
import { PdfModuleError, operationFailure } from '../../core/errors';
import { isNamedBinarySource, readBytes, requireInputs, yieldToEventLoop } from '../../core/input';
import {
  canvasToBlob,
  hasOffscreenCanvas,
  inputToBlob,
  loadImageFromBlob,
} from '../../infrastructure/browser-images';
import type { ImagesToPdfOptions, PageSize } from './definition';

type NormalizedImage = { bytes: Uint8Array; format: 'png' | 'jpeg' };
type PageLayout = { pageWidth: number; pageHeight: number; margin: number };

const PAGE_SIZE_MAP: Record<Exclude<PageSize, 'auto'>, { width: number; height: number }> = {
  a4: { width: 595.28, height: 841.89 },
  letter: { width: 612, height: 792 },
};

const clamp = (value: number, minimum: number, maximum: number): number =>
  Number.isNaN(value) ? minimum : Math.min(Math.max(value, minimum), maximum);

function parseBackgroundColor(color?: string) {
  const fallback = rgb(1, 1, 1);
  if (!color) return fallback;
  const match = color.trim().match(/^#?([0-9a-f]{3}|[0-9a-f]{6})$/i);
  if (!match) return fallback;
  let hex = match[1];
  if (hex.length === 3) hex = hex.split('').map(character => character + character).join('');
  const value = parseInt(hex, 16);
  return rgb(
    ((value >> 16) & 0xff) / 255,
    ((value >> 8) & 0xff) / 255,
    (value & 0xff) / 255,
  );
}

async function normalizeImage(input: BinaryInput): Promise<NormalizedImage> {
  if (isNamedBinarySource(input)) {
    const name = input.name.toLowerCase();
    const mime = (input.type ?? '').toLowerCase();
    if (mime === 'image/png' || name.endsWith('.png')) {
      return { bytes: await readBytes(input), format: 'png' };
    }
    if (mime === 'image/jpeg' || mime === 'image/jpg' || name.endsWith('.jpg') || name.endsWith('.jpeg')) {
      return { bytes: await readBytes(input), format: 'jpeg' };
    }
  }

  const blob = await inputToBlob(input, 'image/*');
  let canvas: HTMLCanvasElement | OffscreenCanvas;

  if (typeof createImageBitmap === 'function') {
    const bitmap = await createImageBitmap(blob);
    if (hasOffscreenCanvas()) {
      canvas = new OffscreenCanvas(bitmap.width, bitmap.height);
    } else if (typeof document !== 'undefined') {
      canvas = document.createElement('canvas');
      canvas.width = bitmap.width;
      canvas.height = bitmap.height;
    } else {
      bitmap.close();
      throw new PdfModuleError('UNSUPPORTED_CAPABILITY', 'Canvas support required for image processing');
    }
    const context = canvas.getContext('2d') as
      | CanvasRenderingContext2D
      | OffscreenCanvasRenderingContext2D
      | null;
    if (!context) {
      bitmap.close();
      throw new PdfModuleError('UNSUPPORTED_CAPABILITY', '2D canvas context is unavailable');
    }
    context.drawImage(bitmap, 0, 0);
    bitmap.close();
  } else {
    const image = await loadImageFromBlob(blob);
    canvas = document.createElement('canvas');
    canvas.width = image.width;
    canvas.height = image.height;
    const context = canvas.getContext('2d');
    if (!context) throw new PdfModuleError('UNSUPPORTED_CAPABILITY', '2D canvas context is unavailable');
    context.drawImage(image, 0, 0);
  }

  return {
    bytes: new Uint8Array(await (await canvasToBlob(canvas, 'image/png')).arrayBuffer()),
    format: 'png',
  };
}

function resolvePageLayout(
  imageWidth: number,
  imageHeight: number,
  options: ImagesToPdfOptions,
  fallbackMargin: number,
): PageLayout {
  const size = options.pageSize ?? 'auto';
  if (size === 'auto') return { pageWidth: imageWidth, pageHeight: imageHeight, margin: 0 };
  const base = PAGE_SIZE_MAP[size];
  const orientation = options.pageOrientation ?? 'auto';
  const landscape = orientation === 'landscape' || (orientation === 'auto' && imageWidth > imageHeight);
  return {
    pageWidth: landscape ? base.height : base.width,
    pageHeight: landscape ? base.width : base.height,
    margin: Math.max(0, fallbackMargin),
  };
}

export async function imagesToPdf(
  inputs: readonly BinaryInput[],
  options: ImagesToPdfOptions = {},
  onProgress?: ProgressCallback,
): Promise<Uint8Array> {
  try {
    requireInputs(inputs, 'imagesToPdf');
    onProgress?.({ percent: 5, stage: 'reading', detail: 'Reading images...' });
    const pdfDoc = await PDFDocument.create();
    const margin = clamp(options.pageMarginPoints ?? 18, 0, 144);
    const background = parseBackgroundColor(options.backgroundColor);

    for (let index = 0; index < inputs.length; index += 1) {
      await yieldToEventLoop();
      const percent = Math.round(5 + (((index + 1) / inputs.length) * 85));
      onProgress?.({
        percent,
        stage: 'embedding',
        current: index + 1,
        total: inputs.length,
        detail: `Embedding image ${index + 1} of ${inputs.length}`,
      });

      const input = inputs[index];
      const normalized = await normalizeImage(input);
      const image = normalized.format === 'png'
        ? await pdfDoc.embedPng(normalized.bytes)
        : await pdfDoc.embedJpg(normalized.bytes);
      const imageSize = image.size();
      const layout = resolvePageLayout(imageSize.width, imageSize.height, options, margin);
      const page = pdfDoc.addPage([layout.pageWidth, layout.pageHeight]);
      page.drawRectangle({
        x: 0,
        y: 0,
        width: layout.pageWidth,
        height: layout.pageHeight,
        color: background,
      });
      const availableWidth = Math.max(layout.pageWidth - layout.margin * 2, 0);
      const availableHeight = Math.max(layout.pageHeight - layout.margin * 2, 0);
      const scale = options.imageFit === 'cover'
        ? Math.max(availableWidth / imageSize.width, availableHeight / imageSize.height)
        : Math.min(availableWidth / imageSize.width, availableHeight / imageSize.height);
      page.drawImage(image, {
        x: (layout.pageWidth - imageSize.width * scale) / 2,
        y: (layout.pageHeight - imageSize.height * scale) / 2,
        width: imageSize.width * scale,
        height: imageSize.height * scale,
      });
    }

    onProgress?.({ percent: 95, stage: 'saving', detail: 'Generating PDF...' });
    return pdfDoc.save({ useObjectStreams: !pdfDoc.context.trailerInfo.Encrypt });
  } catch (error) {
    throw operationFailure('imagesToPdf', 'Failed to convert images to PDF', error);
  }
}

export const imagesToPdfOperation: PdfOperationModule<'imagesToPdf', ImagesToPdfOptions, Uint8Array> = {
  key: 'imagesToPdf',
  execute: imagesToPdf,
};
