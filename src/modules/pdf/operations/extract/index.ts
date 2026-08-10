import { PDFDocument } from 'pdf-lib';
import type { BinaryInput, PdfOperationModule } from '../../core/contracts';
import { PdfModuleError, operationFailure } from '../../core/errors';
import { requireInput } from '../../core/input';
import { copyBasicMetadata, loadPdfWithBasicValidation } from '../../core/pdf-lib';
import type { ExtractOptions } from './definition';

export async function extractPdfPages(
  inputs: readonly BinaryInput[],
  options: ExtractOptions = {},
): Promise<Uint8Array> {
  try {
    const input = requireInput(inputs, 0, 'extract');
    const pageNumbers = options.pagesToExtract ?? [];
    if (pageNumbers.length === 0) {
      throw new PdfModuleError('NO_PAGES', 'No pages to extract', { operation: 'extract' });
    }

    const source = await loadPdfWithBasicValidation(input, {
      ignoreEncryption: true,
      throwOnInvalidObject: false,
    });
    const validIndices = pageNumbers
      .map(pageNumber => pageNumber - 1)
      .filter(index => Number.isInteger(index) && index >= 0 && index < source.getPageCount())
      .sort((left, right) => left - right);

    if (validIndices.length === 0) {
      throw new PdfModuleError('NO_PAGES', 'No valid page numbers provided', { operation: 'extract' });
    }

    const target = await PDFDocument.create();
    const pages = await target.copyPages(source, validIndices);
    pages.forEach(page => target.addPage(page));
    if (options.preserveMetadata !== false) copyBasicMetadata(source, target);
    return target.save({ useObjectStreams: false });
  } catch (error) {
    throw operationFailure('extract', 'Failed to extract pages', error);
  }
}

export const extractOperation: PdfOperationModule<'extract', ExtractOptions, Uint8Array> = {
  key: 'extract',
  execute: extractPdfPages,
};
