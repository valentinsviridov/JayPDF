import { PDFDocument } from 'pdf-lib';
import type { BinaryInput, PdfOperationModule } from '../../core/contracts';
import { PdfModuleError, operationFailure } from '../../core/errors';
import { requireInput, yieldToEventLoop } from '../../core/input';
import { loadPdfWithBasicValidation } from '../../core/pdf-lib';
import type { SplitOptions } from './definition';

export async function splitPdf(
  inputs: readonly BinaryInput[],
  options: SplitOptions = {},
): Promise<Uint8Array[]> {
  try {
    const input = requireInput(inputs, 0, 'split');
    const pagesPerFile = options.pagesPerFile ?? 1;
    if (!Number.isInteger(pagesPerFile) || pagesPerFile < 1) {
      throw new PdfModuleError('INVALID_INPUT', 'Pages per file must be a positive integer', {
        operation: 'split',
      });
    }

    const source = await loadPdfWithBasicValidation(input, {
      ignoreEncryption: true,
      throwOnInvalidObject: false,
    });
    const results: Uint8Array[] = [];

    for (let start = 0; start < source.getPageCount(); start += pagesPerFile) {
      await yieldToEventLoop();
      const target = await PDFDocument.create();
      const end = Math.min(start + pagesPerFile, source.getPageCount());
      const indices = Array.from({ length: end - start }, (_, offset) => start + offset);
      const pages = await target.copyPages(source, indices);
      pages.forEach(page => target.addPage(page));
      results.push(await target.save({ useObjectStreams: false }));
    }

    return results;
  } catch (error) {
    throw operationFailure('split', 'Failed to split PDF', error);
  }
}

export const splitOperation: PdfOperationModule<'split', SplitOptions, Uint8Array[]> = {
  key: 'split',
  execute: splitPdf,
};
