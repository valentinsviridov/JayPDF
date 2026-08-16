import { PDFDocument } from 'pdf-lib';
import type { BinaryInput, PdfOperationModule, ProgressCallback } from '../../core/contracts';
import { operationFailure } from '../../core/errors';
import { requireInput, yieldToEventLoop } from '../../core/input';
import { canvasToBlob } from '../../infrastructure/browser-images';
import {
  createPdfCanvas,
  loadPdfJsDocument,
  pdfjsCanvasFactory,
} from '../../infrastructure/pdfjs';
import type { RepairOptions } from './definition';

export async function repairPdf(
  inputs: readonly BinaryInput[],
  options: RepairOptions = {},
  onProgress?: ProgressCallback,
): Promise<Uint8Array> {
  try {
    onProgress?.({ percent: 5, stage: 'reading', detail: 'Reading damaged PDF...' });
    const input = requireInput(inputs, 0, 'repair');
    const pdf = await loadPdfJsDocument(input);
    const scale = (options.renderDpi ?? 144) / 72;
    const format = options.imageFormat ?? 'jpeg';
    const mimeType = format === 'png' ? 'image/png' : 'image/jpeg';
    const quality = options.imageQuality ?? 0.85;

    const repairedDoc = await PDFDocument.create();

    for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
      await yieldToEventLoop();
      const percent = Math.round(5 + ((pageNumber / pdf.numPages) * 85));
      onProgress?.({
        percent,
        stage: 'repairing',
        current: pageNumber,
        total: pdf.numPages,
        detail: `Reconstructing page ${pageNumber} of ${pdf.numPages}`,
      });

      const page = await pdf.getPage(pageNumber);
      const unscaledViewport = page.getViewport({ scale: 1 });
      const renderViewport = page.getViewport({ scale });

      const { canvas, context } = createPdfCanvas(
        Math.ceil(renderViewport.width),
        Math.ceil(renderViewport.height),
      );
      context.fillStyle = '#ffffff';
      context.fillRect(0, 0, canvas.width, canvas.height);

      await page.render({
        canvasContext: context,
        viewport: renderViewport,
        canvasFactory: pdfjsCanvasFactory,
      }).promise;

      const blob = await canvasToBlob(canvas, mimeType, quality);
      const imageBytes = new Uint8Array(await blob.arrayBuffer());

      const embeddedImage = format === 'png'
        ? await repairedDoc.embedPng(imageBytes)
        : await repairedDoc.embedJpg(imageBytes);

      const newPage = repairedDoc.addPage([unscaledViewport.width, unscaledViewport.height]);
      newPage.drawImage(embeddedImage, {
        x: 0,
        y: 0,
        width: unscaledViewport.width,
        height: unscaledViewport.height,
      });

      page.cleanup();
    }

    onProgress?.({ percent: 95, stage: 'saving', detail: 'Assembling clean PDF...' });
    return repairedDoc.save({ useObjectStreams: false });
  } catch (error) {
    throw operationFailure('repair', 'Failed to repair PDF', error);
  }
}

export const repairOperation: PdfOperationModule<
  'repair',
  RepairOptions,
  Uint8Array
> = {
  key: 'repair',
  execute: repairPdf,
};
