import { PDFDocument } from 'pdf-lib';
import type { BinaryInput, PdfOperationModule } from '../../core/contracts';
import { PdfModuleError, operationFailure } from '../../core/errors';
import { requireInput } from '../../core/input';
import { copyBasicMetadata, loadPdfWithBasicValidation } from '../../core/pdf-lib';
import type { ReorderOptions } from './definition';

export async function reorderPdfPages(
  inputs: readonly BinaryInput[],
  options: ReorderOptions = {},
): Promise<Uint8Array> {
  try {
    const input = requireInput(inputs, 0, 'reorder');
    const pageOrder = options.pageOrder ?? [];
    if (pageOrder.length === 0) {
      throw new PdfModuleError('NO_PAGES', 'No page order provided', { operation: 'reorder' });
    }

    const source = await loadPdfWithBasicValidation(input, {
      ignoreEncryption: true,
      throwOnInvalidObject: false,
    });
    const validIndices = pageOrder
      .map(pageNumber => pageNumber - 1)
      .filter(index => Number.isInteger(index) && index >= 0 && index < source.getPageCount());

    if (validIndices.length === 0) {
      throw new PdfModuleError('NO_PAGES', 'No valid page numbers in order', { operation: 'reorder' });
    }

    const target = await PDFDocument.create();
    const pages = await target.copyPages(source, validIndices);
    pages.forEach(page => target.addPage(page));
    if (options.preserveMetadata !== false) copyBasicMetadata(source, target);
    return target.save({ useObjectStreams: false });
  } catch (error) {
    throw operationFailure('reorder', 'Failed to reorder pages', error);
  }
}

export const reorderOperation: PdfOperationModule<'reorder', ReorderOptions, Uint8Array> = {
  key: 'reorder',
  execute: reorderPdfPages,
};
