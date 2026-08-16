import type { BinaryInput, PdfOperationModule, ProgressCallback } from '../../core/contracts';
import { operationFailure } from '../../core/errors';
import { readBytes, requireInput } from '../../core/input';
import { loadPdfWithBasicValidation } from '../../core/pdf-lib';
import type { CompressOptions, CompressionResult } from './definition';
import { applyCompressionEnhancements } from './enhancements';

export async function compressPdf(
  inputs: readonly BinaryInput[],
  options: CompressOptions = {},
  onProgress?: ProgressCallback,
): Promise<CompressionResult> {
  const startedAt = performance.now();
  try {
    onProgress?.({ percent: 10, stage: 'reading', detail: 'Reading document...' });
    const input = requireInput(inputs, 0, 'compress');
    const bytes = await readBytes(input);
    const pdfDoc = await loadPdfWithBasicValidation(
      input,
      {
        ignoreEncryption: true,
        throwOnInvalidObject: false,
        updateMetadata: options.preserveMetadata !== false,
      },
      { autoRepairCorrupted: options.autoRepairCorrupted },
    );
    onProgress?.({ percent: 40, stage: 'optimizing', detail: 'Optimizing streams & graphics...' });
    const enhancements = await applyCompressionEnhancements(pdfDoc, {
      removeMetadata: options.preserveMetadata === false,
      stripAnnotations: options.stripAnnotations === true,
      downscaleImages: options.downscaleImages === true,
      targetDpi: options.downscaleImagesDpi ?? 150,
      imageQuality: options.imageQuality ?? 0.82,
    });
    onProgress?.({ percent: 75, stage: 'compressing', detail: 'Re-encoding PDF objects...' });
    const result = await pdfDoc.save({
      useObjectStreams: !pdfDoc.context.trailerInfo.Encrypt,
      addDefaultPage: false,
      objectsPerTick: (options.compressionLevel ?? 'medium') === 'high' ? 500 : 200,
    });
    onProgress?.({ percent: 100, stage: 'complete', detail: 'Compression complete' });

    return {
      data: result,
      originalSize: bytes.byteLength,
      processedSize: result.length,
      compressionRatio: result.length / bytes.byteLength,
      processingTimeMs: performance.now() - startedAt,
      universalOptimizedCount: enhancements.universalOptimizedCount,
    };
  } catch (error) {
    throw operationFailure('compress', 'Failed to compress PDF', error);
  }
}

export const compressOperation: PdfOperationModule<
  'compress',
  CompressOptions,
  CompressionResult
> = {
  key: 'compress',
  execute: compressPdf,
};
