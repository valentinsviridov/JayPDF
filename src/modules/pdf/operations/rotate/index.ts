import { degrees } from 'pdf-lib';
import type { BinaryInput, PdfOperationModule, ProgressCallback } from '../../core/contracts';
import { PdfModuleError, operationFailure } from '../../core/errors';
import { requireInput, yieldToEventLoop } from '../../core/input';
import { applyMetadata, loadPdfWithBasicValidation } from '../../core/pdf-lib';
import type { RotateOptions } from './definition';

export function normalizeRotation(angle: number): 0 | 90 | 180 | 270 {
  const normalized = ((angle % 360) + 360) % 360;
  if (normalized === 0 || normalized === 90 || normalized === 180 || normalized === 270) {
    return normalized;
  }
  throw new PdfModuleError('INVALID_INPUT', `Invalid rotation angle: ${angle}`, {
    operation: 'rotate',
  });
}

export async function rotatePdfPages(
  inputs: readonly BinaryInput[],
  options: RotateOptions = {},
  onProgress?: ProgressCallback,
): Promise<Uint8Array> {
  try {
    onProgress?.({ percent: 10, stage: 'reading', detail: 'Reading document...' });
    const input = requireInput(inputs, 0, 'rotate');
    const pageNumbers = options.pagesToRotate ?? [];
    if (pageNumbers.length === 0) {
      throw new PdfModuleError('NO_PAGES', 'No pages to rotate', { operation: 'rotate' });
    }

    const rotationDegrees = options.rotationDegrees ?? 90;
    const pdfDoc = await loadPdfWithBasicValidation(
      input,
      {
        ignoreEncryption: true,
        throwOnInvalidObject: false,
        updateMetadata: options.preserveMetadata !== false,
      },
      { autoRepairCorrupted: options.autoRepairCorrupted },
    );
    const validIndices = [...new Set(
      pageNumbers
        .map(pageNumber => pageNumber - 1)
        .filter(index => Number.isInteger(index) && index >= 0 && index < pdfDoc.getPageCount()),
    )];
    if (validIndices.length === 0) {
      throw new PdfModuleError('NO_PAGES', 'No valid page numbers provided', { operation: 'rotate' });
    }

    for (let i = 0; i < validIndices.length; i += 1) {
      await yieldToEventLoop();
      const pageIndex = validIndices[i];
      const percent = Math.round(15 + (((i + 1) / validIndices.length) * 75));
      onProgress?.({
        percent,
        stage: 'rotating',
        current: i + 1,
        total: validIndices.length,
        detail: `Rotating page ${pageIndex + 1}`,
      });
      const page = pdfDoc.getPage(pageIndex);
      page.setRotation(degrees(normalizeRotation(page.getRotation().angle + rotationDegrees)));
    }

    onProgress?.({ percent: 90, stage: 'saving', detail: 'Finalizing rotated PDF...' });
    applyMetadata(pdfDoc, options.metadata);
    return pdfDoc.save({
      useObjectStreams: !pdfDoc.context.trailerInfo.Encrypt,
      addDefaultPage: false,
    });
  } catch (error) {
    throw operationFailure('rotate', 'Failed to rotate pages', error);
  }
}

export const rotateOperation: PdfOperationModule<'rotate', RotateOptions, Uint8Array> = {
  key: 'rotate',
  execute: rotatePdfPages,
};
