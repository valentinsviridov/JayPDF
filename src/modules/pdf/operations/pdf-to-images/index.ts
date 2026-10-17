import type { BinaryInput, PdfOperationModule, ProgressCallback } from '../../core/contracts';
import { operationFailure } from '../../core/errors';
import { isNamedBinarySource, requireInput, yieldToEventLoop } from '../../core/input';
import { canvasToBlob } from '../../infrastructure/browser-images';
import {
  createPdfCanvas,
  loadPdfJsDocument,
  pdfjsCanvasFactory,
} from '../../infrastructure/pdfjs';
import type { PdfToImagesOptions, PdfToImagesResult } from './definition';

export function sanitizeImageBaseName(raw: string): string {
  const normalized = raw
    .trim()
    .replace(/[^\p{L}\p{N}\-_. ]/gu, '-')
    .replace(/\s+/g, '-');
  const cleaned = normalized.replace(/-+/g, '-').replace(/^-|-$/g, '');
  return cleaned.length > 0 ? cleaned.toLowerCase() : 'jaypdf';
}

function stripExtension(fileName: string): string {
  const dotIndex = fileName.lastIndexOf('.');
  return dotIndex <= 0 ? fileName : fileName.slice(0, dotIndex);
}

export async function pdfToImages(
  inputs: readonly BinaryInput[],
  options: PdfToImagesOptions = {},
  onProgress?: ProgressCallback,
): Promise<PdfToImagesResult> {
  try {
    onProgress?.({ percent: 5, stage: 'reading', detail: 'Reading PDF document...' });
    const input = requireInput(inputs, 0, 'pdfToImages');
    const pdf = await loadPdfJsDocument(input);
    const scale = (options.imageRenderDpi ?? 144) / 72;
    const format = options.imageOutputFormat ?? 'png';
    const extension = format === 'png' ? 'png' : 'jpg';
    const fallbackName = isNamedBinarySource(input) ? stripExtension(input.name) : 'jaypdf';
    const baseName = sanitizeImageBaseName(options.imageBaseName?.trim() || fallbackName);
    const files: Array<{ name: string; blob: Blob }> = [];

    for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
      await yieldToEventLoop();
      const percent = Math.round(5 + ((pageNumber / pdf.numPages) * 85));
      onProgress?.({
        percent,
        stage: 'converting',
        current: pageNumber,
        total: pdf.numPages,
        detail: `Rendering page ${pageNumber} of ${pdf.numPages}`,
      });

      const page = await pdf.getPage(pageNumber);
      const viewport = page.getViewport({ scale });
      const { canvas, context } = createPdfCanvas(
        Math.ceil(viewport.width),
        Math.ceil(viewport.height),
      );
      context.fillStyle = '#ffffff';
      context.fillRect(0, 0, canvas.width, canvas.height);
      await page.render({ canvasContext: context, viewport, canvasFactory: pdfjsCanvasFactory }).promise;
      const blob = await canvasToBlob(
        canvas,
        format === 'jpeg' ? 'image/jpeg' : 'image/png',
        options.imageOutputQuality,
      );
      files.push({
        name: `${baseName}_${String(pageNumber).padStart(String(pdf.numPages).length, '0')}.${extension}`,
        blob,
      });
      page.cleanup();
    }

    if (options.bundleAsZip === false) {
      onProgress?.({ percent: 100, stage: 'complete', detail: 'Conversion complete' });
      return { kind: 'files', files, imageCount: files.length, format };
    }

    onProgress?.({ percent: 92, stage: 'packaging', detail: 'Creating ZIP archive...' });
    const { default: JSZip } = await import('jszip');
    const zip = new JSZip();
    files.forEach(file => zip.file(file.name, file.blob));
    const zipBlob = await zip.generateAsync({ type: 'blob' });
    onProgress?.({ percent: 100, stage: 'complete', detail: 'Conversion complete' });
    return {
      kind: 'zip',
      blob: zipBlob,
      imageCount: files.length,
      format,
      suggestedName: `${baseName}_${extension}.zip`,
    };
  } catch (error) {
    throw operationFailure('pdfToImages', 'Failed to convert PDF to images', error);
  }
}

export const pdfToImagesOperation: PdfOperationModule<
  'pdfToImages',
  PdfToImagesOptions,
  PdfToImagesResult
> = {
  key: 'pdfToImages',
  execute: pdfToImages,
};
