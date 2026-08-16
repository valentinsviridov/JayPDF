import { PDFDocument, rgb } from 'pdf-lib';
import type { BinaryInput, PdfOperationModule } from '../../core/contracts';
import { operationFailure } from '../../core/errors';
import { readBytes, requireInputs, yieldToEventLoop } from '../../core/input';
import { applyMetadata, loadPdfWithBasicValidation } from '../../core/pdf-lib';
import type { MergeOptions } from './definition';

export async function mergePdfs(
  inputs: readonly BinaryInput[],
  options: MergeOptions = {},
): Promise<Uint8Array> {
  try {
    requireInputs(inputs, 'merge');
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
        return source.save({ useObjectStreams: false });
      }
      return new Uint8Array(await readBytes(inputs[0]));
    }

    const mergedPdf = await PDFDocument.create();
    for (let index = 0; index < inputs.length; index += 1) {
      await yieldToEventLoop();
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
