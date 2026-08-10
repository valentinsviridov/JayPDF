import type { BinaryInput, PdfOperationModule } from '../../core/contracts';
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
  return cleaned.length > 0 ? cleaned.toLowerCase() : 'pdflince';
}

function stripExtension(fileName: string): string {
  const dotIndex = fileName.lastIndexOf('.');
  return dotIndex <= 0 ? fileName : fileName.slice(0, dotIndex);
}

export async function pdfToImages(
  inputs: readonly BinaryInput[],
  options: PdfToImagesOptions = {},
): Promise<PdfToImagesResult> {
  try {
    const input = requireInput(inputs, 0, 'pdfToImages');
    const pdf = await loadPdfJsDocument(input);
    const scale = (options.imageRenderDpi ?? 144) / 72;
    const format = options.imageOutputFormat ?? 'png';
    const extension = format === 'png' ? 'png' : 'jpg';
    const fallbackName = isNamedBinarySource(input) ? stripExtension(input.name) : 'pdflince';
    const baseName = sanitizeImageBaseName(options.imageBaseName ?? fallbackName);
    const files: Array<{ name: string; blob: Blob }> = [];

    for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
      await yieldToEventLoop();
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
      return { kind: 'files', files, imageCount: files.length, format };
    }

    const { default: JSZip } = await import('jszip');
    const zip = new JSZip();
    files.forEach(file => zip.file(file.name, file.blob));
    return {
      kind: 'zip',
      blob: await zip.generateAsync({ type: 'blob' }),
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
