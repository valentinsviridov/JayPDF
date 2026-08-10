import type { BinaryInput, PdfOperationModule } from '../../core/contracts';
import { operationFailure } from '../../core/errors';
import { readBytes, requireInput } from '../../core/input';
import { loadPdfWithBasicValidation } from '../../core/pdf-lib';
import type { CompressOptions, CompressionResult } from './definition';
import { applyCompressionEnhancements } from './enhancements';

export async function compressPdf(
  inputs: readonly BinaryInput[],
  options: CompressOptions = {},
): Promise<CompressionResult> {
  const startedAt = performance.now();
  try {
    const input = requireInput(inputs, 0, 'compress');
    const bytes = await readBytes(input);
    const pdfDoc = await loadPdfWithBasicValidation(bytes, {
      ignoreEncryption: true,
      throwOnInvalidObject: false,
      updateMetadata: options.preserveMetadata !== false,
    });
    const enhancements = await applyCompressionEnhancements(pdfDoc, {
      removeMetadata: options.preserveMetadata === false,
      stripAnnotations: options.stripAnnotations === true,
      downscaleImages: options.downscaleImages === true,
      targetDpi: options.downscaleImagesDpi ?? 150,
      imageQuality: options.imageQuality ?? 0.82,
    });
    const result = await pdfDoc.save({
      useObjectStreams: !pdfDoc.context.trailerInfo.Encrypt,
      addDefaultPage: false,
      objectsPerTick: (options.compressionLevel ?? 'medium') === 'high' ? 500 : 50,
    });

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
