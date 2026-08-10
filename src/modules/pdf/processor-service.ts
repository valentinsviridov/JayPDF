import type {
  PdfOperationKey,
  PdfOperationOptions,
  PdfOperationResult,
} from './operation-map';
import type { CompressionResult } from './operations/compress/definition';
import type { PdfToImagesResult } from './operations/pdf-to-images/definition';
import { executePdfOperation } from './execute';
import { PdfModuleError } from './core/errors';
import { PdfWorkerClient, pdfWorkerClient } from './worker-client';

export interface BrowserPdfResultMap {
  compress: CompressionResult;
  merge: Blob;
  split: Blob[];
  extract: Blob;
  crop: Blob;
  rotate: Blob;
  reorder: Blob;
  pdfToImages: PdfToImagesResult;
  imagesToPdf: Blob;
}

export type BrowserPdfResult<Key extends PdfOperationKey> = BrowserPdfResultMap[Key];

export interface PdfProcessorService {
  execute<Key extends PdfOperationKey>(
    operation: Key,
    files: readonly File[],
    options: PdfOperationOptions<Key>,
  ): Promise<BrowserPdfResult<Key>>;
}

export function createPdfBlob(bytes: Uint8Array): Blob {
  if (bytes.buffer instanceof ArrayBuffer) {
    const buffer = bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength);
    return new Blob([buffer], { type: 'application/pdf' });
  }
  const buffer = new ArrayBuffer(bytes.byteLength);
  new Uint8Array(buffer).set(bytes);
  return new Blob([buffer], { type: 'application/pdf' });
}

type ResultAdapter<Key extends PdfOperationKey> = (
  result: PdfOperationResult<Key>,
) => BrowserPdfResult<Key>;

type ResultAdapters = { [Key in PdfOperationKey]: ResultAdapter<Key> };

const resultAdapters: ResultAdapters = {
  compress: result => result,
  merge: createPdfBlob,
  split: result => result.map(createPdfBlob),
  extract: createPdfBlob,
  crop: createPdfBlob,
  rotate: createPdfBlob,
  reorder: createPdfBlob,
  pdfToImages: result => result,
  imagesToPdf: createPdfBlob,
};

export function createBrowserPdfProcessorService(
  workerClient: PdfWorkerClient = pdfWorkerClient,
): PdfProcessorService {
  return {
    async execute<Key extends PdfOperationKey>(operation: Key, files: readonly File[], options: PdfOperationOptions<Key>) {
      let result: PdfOperationResult<Key>;
      try {
        result = await workerClient.runOperation(operation, [...files], options);
      } catch (workerError) {
        const canFallback = workerError instanceof PdfModuleError &&
          (workerError.code === 'WORKER_TRANSPORT' || workerError.code === 'UNSUPPORTED_CAPABILITY');
        if (!canFallback) throw workerError;
        console.warn(`Worker ${operation} failed, falling back to main thread`, workerError);
        result = await executePdfOperation(operation, files, options);
      }
      const adapt = resultAdapters[operation] as ResultAdapter<Key>;
      return adapt(result);
    },
  };
}

export const browserPdfProcessorService = createBrowserPdfProcessorService();
