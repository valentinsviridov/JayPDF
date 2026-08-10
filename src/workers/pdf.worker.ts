import { executePdfOperation } from '../modules/pdf/execute';
import { getPdfJsPageCount } from '../modules/pdf/infrastructure/pdfjs';
import type { PdfOperationKey, PdfOperationOptions } from '../modules/pdf/operation-map';
import {
  collectPdfTransferables,
  isPdfWorkerRequest,
  serializePdfError,
  type PdfOperationWorkerRequest,
  type PdfWorkerResponse,
} from '../modules/pdf/worker-protocol';
import { installPdfWorkerEnvironment } from '../modules/pdf/worker-environment';

installPdfWorkerEnvironment();

async function executeOperationRequest<Key extends PdfOperationKey>(
  request: PdfOperationWorkerRequest<Key>,
) {
  return executePdfOperation(
    request.operation,
    request.files,
    request.options as PdfOperationOptions<Key>,
  );
}

self.onmessage = async (event: MessageEvent<unknown>) => {
  const candidate = event.data;
  if (!isPdfWorkerRequest(candidate)) {
    const id = candidate && typeof candidate === 'object' && 'id' in candidate
      ? String((candidate as { id: unknown }).id)
      : 'unknown';
    const response: PdfWorkerResponse = {
      id,
      success: false,
      error: serializePdfError(new Error('Invalid PDF worker request')),
    };
    self.postMessage(response);
    return;
  }

  try {
    const result = candidate.task === 'pageCount'
      ? await getPdfJsPageCount(candidate.files[0])
      : await executeOperationRequest(candidate);
    const response: PdfWorkerResponse = { id: candidate.id, success: true, result };
    self.postMessage(response, { transfer: collectPdfTransferables(result) });
  } catch (error) {
    const response: PdfWorkerResponse = {
      id: candidate.id,
      success: false,
      error: serializePdfError(
        error,
        candidate.task === 'operation' ? candidate.operation : 'pageCount',
      ),
    };
    self.postMessage(response);
  }
};
