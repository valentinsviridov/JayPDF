import { PDFDocument } from 'pdf-lib';
import type { BinaryInput, PdfOperationModule, ProgressCallback } from '../../core/contracts';
import { PdfModuleError, operationFailure } from '../../core/errors';
import { requireInput, yieldToEventLoop } from '../../core/input';
import { loadPdfWithBasicValidation } from '../../core/pdf-lib';
import type { SplitOptions } from './definition';

export async function splitPdf(
  inputs: readonly BinaryInput[],
  options: SplitOptions = {},
  onProgress?: ProgressCallback,
): Promise<Uint8Array[]> {
  try {
    onProgress?.({ percent: 10, stage: 'reading', detail: 'Reading document...' });
    const input = requireInput(inputs, 0, 'split');
    const pagesPerFile = options.pagesPerFile ?? 1;
    if (!Number.isInteger(pagesPerFile) || pagesPerFile < 1) {
      throw new PdfModuleError('INVALID_INPUT', 'Pages per file must be a positive integer', {
        operation: 'split',
      });
    }

    const source = await loadPdfWithBasicValidation(
      input,
      {
        ignoreEncryption: true,
        throwOnInvalidObject: false,
      },
      { autoRepairCorrupted: options.autoRepairCorrupted },
    );
    const results: Uint8Array[] = [];
    const totalPages = source.getPageCount();
    const totalChunks = Math.ceil(totalPages / pagesPerFile);
    let chunkIndex = 0;

    for (let start = 0; start < totalPages; start += pagesPerFile) {
      await yieldToEventLoop();
      chunkIndex += 1;
      const percent = Math.round(15 + ((chunkIndex / totalChunks) * 80));
      onProgress?.({
        percent,
        stage: 'splitting',
        current: chunkIndex,
        total: totalChunks,
        detail: `Creating part ${chunkIndex} of ${totalChunks}`,
      });
      const target = await PDFDocument.create();
      const end = Math.min(start + pagesPerFile, totalPages);
      const indices = Array.from({ length: end - start }, (_, offset) => start + offset);
      const pages = await target.copyPages(source, indices);
      pages.forEach(page => target.addPage(page));
      results.push(await target.save({ useObjectStreams: false }));
    }

    onProgress?.({ percent: 100, stage: 'complete', detail: 'Split complete' });
    return results;
  } catch (error) {
    throw operationFailure('split', 'Failed to split PDF', error);
  }
}

export const splitOperation: PdfOperationModule<'split', SplitOptions, Uint8Array[]> = {
  key: 'split',
  execute: splitPdf,
};
