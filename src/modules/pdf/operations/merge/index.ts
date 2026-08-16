import { PDFDocument, rgb } from 'pdf-lib';
import type { BinaryInput, PdfOperationModule, ProgressCallback } from '../../core/contracts';
import { operationFailure } from '../../core/errors';
import { readBytes, requireInputs, yieldToEventLoop } from '../../core/input';
import { applyMetadata, loadPdfWithBasicValidation } from '../../core/pdf-lib';
import type { MergeOptions } from './definition';

export async function mergePdfs(
  inputs: readonly BinaryInput[],
  options: MergeOptions = {},
  onProgress?: ProgressCallback,
): Promise<Uint8Array> {
  try {
    requireInputs(inputs, 'merge');
    onProgress?.({ percent: 5, stage: 'reading', detail: 'Reading documents...' });
    if (inputs.length === 1) {
      const source = await loadPdfWithBasicValidation(
        inputs[0],
        {
          ignoreEncryption: true,
          throwOnInvalidObject: false,
        },
        { autoRepairCorrupted: options.autoRepairCorrupted },
      );
      if (options.metadata || options.autoRepairCorrupted) {
        if (options.metadata) applyMetadata(source, options.metadata);
        onProgress?.({ percent: 100, stage: 'complete', detail: 'Done' });
        return source.save({ useObjectStreams: false });
      }
      onProgress?.({ percent: 100, stage: 'complete', detail: 'Done' });
      return new Uint8Array(await readBytes(inputs[0]));
    }

    const mergedPdf = await PDFDocument.create();
    for (let index = 0; index < inputs.length; index += 1) {
      await yieldToEventLoop();
      const percent = Math.round(5 + (((index + 1) / inputs.length) * 85));
      onProgress?.({
        percent,
        stage: 'merging',
        current: index + 1,
        total: inputs.length,
        detail: `Merging document ${index + 1} of ${inputs.length}`,
      });

      const source = await loadPdfWithBasicValidation(
        inputs[index],
        {
          ignoreEncryption: true,
          throwOnInvalidObject: false,
        },
        { autoRepairCorrupted: options.autoRepairCorrupted },
      );
      const copiedPages = await mergedPdf.copyPages(source, source.getPageIndices());
      copiedPages.forEach(page => mergedPdf.addPage(page));

      if (options.addPageDividers && index < inputs.length - 1) {
        const divider = mergedPdf.addPage();
        const { width, height } = divider.getSize();
        divider.drawRectangle({ x: 0, y: 0, width, height, color: rgb(1, 1, 1) });
      }
    }

    onProgress?.({ percent: 95, stage: 'saving', detail: 'Finalizing merged PDF...' });
    applyMetadata(mergedPdf, options.metadata);
    return mergedPdf.save({ useObjectStreams: false });
  } catch (error) {
    throw operationFailure('merge', 'Failed to merge PDFs', error);
  }
}

export const mergeOperation: PdfOperationModule<'merge', MergeOptions, Uint8Array> = {
  key: 'merge',
  execute: mergePdfs,
};
