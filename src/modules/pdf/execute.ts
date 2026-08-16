import type { BinaryInput, ProgressCallback } from './core/contracts';
import type {
  PdfOperationKey,
  PdfOperationOptions,
  PdfOperationResult,
} from './operation-map';
import { loadPdfOperation } from './registry';

export async function executePdfOperation<Key extends PdfOperationKey>(
  key: Key,
  inputs: readonly BinaryInput[],
  options: PdfOperationOptions<Key>,
  onProgress?: ProgressCallback,
): Promise<PdfOperationResult<Key>> {
  const operation = await loadPdfOperation(key);
  return operation.execute(inputs, options, onProgress);
}
