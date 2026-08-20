import type { PdfOperationModule } from './core/contracts';
import type {
  PdfOperationKey,
  PdfOperationOptions,
  PdfOperationResult,
} from './operation-map';

type OperationLoader<Key extends PdfOperationKey> = () => Promise<
  PdfOperationModule<Key, PdfOperationOptions<Key>, PdfOperationResult<Key>>
>;

type OperationLoaders = {
  [Key in PdfOperationKey]: OperationLoader<Key>;
};

const operationLoaders: OperationLoaders = {
  compress: async () => (await import('./operations/compress')).compressOperation,
  merge: async () => (await import('./operations/merge')).mergeOperation,
  split: async () => (await import('./operations/split')).splitOperation,
  extract: async () => (await import('./operations/extract')).extractOperation,
  crop: async () => (await import('./operations/crop')).cropOperation,
  rotate: async () => (await import('./operations/rotate')).rotateOperation,
  reorder: async () => (await import('./operations/reorder')).reorderOperation,
  pdfToImages: async () => (await import('./operations/pdf-to-images')).pdfToImagesOperation,
  imagesToPdf: async () => (await import('./operations/images-to-pdf')).imagesToPdfOperation,
  repair: async () => (await import('./operations/repair')).repairOperation,
};

export function isPdfOperationKey(value: unknown): value is PdfOperationKey {
  return typeof value === 'string' && Object.prototype.hasOwnProperty.call(operationLoaders, value);
}

export async function loadPdfOperation<Key extends PdfOperationKey>(
  key: Key,
): Promise<PdfOperationModule<Key, PdfOperationOptions<Key>, PdfOperationResult<Key>>> {
  const loader = operationLoaders[key] as OperationLoader<Key>;
  const operation = await loader();
  if (operation.key !== key) {
    throw new Error(`PDF operation registry mismatch: requested ${key}, loaded ${operation.key}`);
  }
  return operation;
}

export async function preloadAllPdfOperations(): Promise<void> {
  const keys = Object.keys(operationLoaders) as PdfOperationKey[];
  await Promise.allSettled(keys.map(key => loadPdfOperation(key)));
}
