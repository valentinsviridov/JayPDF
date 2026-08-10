import { PdfModuleError, type PdfErrorCode } from './core/errors';
import type {
  PdfOperationKey,
  PdfOperationMap,
  PdfOperationOptions,
} from './operation-map';
import { isPdfOperationKey } from './registry';

export type PdfOperationWorkerRequest<Key extends PdfOperationKey = PdfOperationKey> = {
  id: string;
  task: 'operation';
  operation: Key;
  files: File[];
  options: PdfOperationOptions<Key>;
};

export type PdfPageCountWorkerRequest = {
  id: string;
  task: 'pageCount';
  files: [File];
};

export type PdfWorkerRequest = {
  [Key in PdfOperationKey]: PdfOperationWorkerRequest<Key>;
}[PdfOperationKey] | PdfPageCountWorkerRequest;

export type SerializedPdfError = {
  code: PdfErrorCode;
  message: string;
  operation?: string;
};

export type PdfWorkerResponse =
  | { id: string; success: true; result: unknown }
  | { id: string; success: false; error: SerializedPdfError };

export function isPdfWorkerRequest(value: unknown): value is PdfWorkerRequest {
  if (!value || typeof value !== 'object') return false;
  const request = value as Partial<PdfWorkerRequest>;
  if (typeof request.id !== 'string' || !Array.isArray(request.files)) return false;
  if (request.task === 'pageCount') return request.files.length === 1;
  if (request.task !== 'operation') return false;
  return isPdfOperationKey(request.operation) &&
    typeof (request as { options?: unknown }).options === 'object';
}

export function serializePdfError(error: unknown, operation?: string): SerializedPdfError {
  if (error instanceof PdfModuleError) {
    return { code: error.code, message: error.message, operation: error.operation ?? operation };
  }
  return {
    code: 'OPERATION_FAILED',
    message: error instanceof Error ? error.message : String(error),
    operation,
  };
}

export function deserializePdfError(error: SerializedPdfError): PdfModuleError {
  return new PdfModuleError(error.code, error.message, { operation: error.operation });
}

function addArrayBuffer(
  buffer: ArrayBufferLike,
  transferables: Set<ArrayBuffer>,
): void {
  if (buffer instanceof ArrayBuffer) transferables.add(buffer);
}

export function collectPdfTransferables(result: unknown): Transferable[] {
  const transferables = new Set<ArrayBuffer>();
  if (result instanceof Uint8Array) {
    addArrayBuffer(result.buffer, transferables);
  } else if (Array.isArray(result)) {
    result.forEach(value => {
      if (value instanceof Uint8Array) addArrayBuffer(value.buffer, transferables);
    });
  } else if (result && typeof result === 'object' && 'data' in result) {
    const data = (result as { data?: unknown }).data;
    if (data instanceof Uint8Array) addArrayBuffer(data.buffer, transferables);
  }
  return [...transferables];
}

export type WorkerOperationResult<Key extends PdfOperationKey> = PdfOperationMap[Key]['result'];
