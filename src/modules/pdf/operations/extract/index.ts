import { PDFDocument } from 'pdf-lib';
import type { BinaryInput, PdfOperationModule, ProgressCallback } from '../../core/contracts';
import { PdfModuleError, operationFailure } from '../../core/errors';
import { requireInput, yieldToEventLoop } from '../../core/input';
import { copyBasicMetadata, loadPdfWithBasicValidation } from '../../core/pdf-lib';
import type { ExtractOptions } from './definition';

export async function extractPdfPages(
  inputs: readonly BinaryInput[],
  options: ExtractOptions = {},
  onProgress?: ProgressCallback,
): Promise<Uint8Array> {
  try {
    onProgress?.({ percent: 10, stage: 'reading', detail: 'Reading document...' });
    const input = requireInput(inputs, 0, 'extract');
    const pageNumbers = options.pagesToExtract ?? [];
    if (pageNumbers.length === 0) {
      throw new PdfModuleError('NO_PAGES', 'No pages to extract', { operation: 'extract' });
    }

    const source = await loadPdfWithBasicValidation(
      input,
      {
        ignoreEncryption: true,
        throwOnInvalidObject: false,
      },
      { autoRepairCorrupted: options.autoRepairCorrupted },
    );
    const validIndices = pageNumbers
      .map(pageNumber => pageNumber - 1)
      .filter(index => Number.isInteger(index) && index >= 0 && index < source.getPageCount())
      .sort((left, right) => left - right);

    if (validIndices.length === 0) {
      throw new PdfModuleError('NO_PAGES', 'No valid page numbers provided', { operation: 'extract' });
    }

    onProgress?.({ percent: 40, stage: 'extracting', detail: `Extracting ${validIndices.length} pages...` });
    await yieldToEventLoop();
    const target = await PDFDocument.create();
    const pages = await target.copyPages(source, validIndices);
    pages.forEach(page => target.addPage(page));
    if (options.preserveMetadata !== false) copyBasicMetadata(source, target);
    onProgress?.({ percent: 90, stage: 'saving', detail: 'Finalizing extracted PDF...' });
    return target.save({ useObjectStreams: false });
  } catch (error) {
    throw operationFailure('extract', 'Failed to extract pages', error);
  }
}

export const extractOperation: PdfOperationModule<'extract', ExtractOptions, Uint8Array> = {
  key: 'extract',
  execute: extractPdfPages,
};
