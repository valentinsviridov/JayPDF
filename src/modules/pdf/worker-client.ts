import { PdfModuleError } from './core/errors';
import type {
  PdfOperationKey,
  PdfOperationOptions,
  PdfOperationResult,
} from './operation-map';
import {
  deserializePdfError,
  type PdfWorkerRequest,
  type PdfWorkerResponse,
} from './worker-protocol';

export interface PdfWorkerLike {
  onmessage: ((event: MessageEvent<PdfWorkerResponse>) => void) | null;
  onerror: ((event: ErrorEvent) => void) | null;
  onmessageerror: ((event: MessageEvent<unknown>) => void) | null;
  postMessage(message: PdfWorkerRequest): void;
  terminate(): void;
}

export type PdfWorkerFactory = () => PdfWorkerLike;

import type { ProgressCallback } from './core/contracts';

type PendingRequest = {
  resolve(value: unknown): void;
  reject(reason: unknown): void;
  onProgress?: ProgressCallback;
};

const defaultWorkerFactory: PdfWorkerFactory = () =>
  new Worker(new URL('../../workers/pdf.worker.ts', import.meta.url)) as PdfWorkerLike;

const defaultIdFactory = (): string => {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
};

export class PdfWorkerClient {
  private worker: PdfWorkerLike | null = null;
  private readonly pendingRequests = new Map<string, PendingRequest>();

  constructor(
    private readonly workerFactory: PdfWorkerFactory = defaultWorkerFactory,
    private readonly idFactory: () => string = defaultIdFactory,
  ) {}

  runOperation<Key extends PdfOperationKey>(
    operation: Key,
    files: File[],
    options: PdfOperationOptions<Key>,
    onProgress?: ProgressCallback,
  ): Promise<PdfOperationResult<Key>> {
    return this.request<PdfOperationResult<Key>>({
      id: this.idFactory(),
      task: 'operation',
      operation,
      files,
      options,
    } as PdfWorkerRequest, onProgress);
  }

  getPageCount(file: File): Promise<number> {
    return this.request<number>({
      id: this.idFactory(),
      task: 'pageCount',
      files: [file],
    });
  }

  terminate(reason = 'PDF worker terminated'): void {
    this.worker?.terminate();
    this.worker = null;
    this.rejectAll(new PdfModuleError('WORKER_TRANSPORT', reason));
  }

  get pendingRequestCount(): number {
    return this.pendingRequests.size;
  }

  private request<Result>(request: PdfWorkerRequest, onProgress?: ProgressCallback): Promise<Result> {
    let worker: PdfWorkerLike;
    try {
      worker = this.getWorker();
    } catch (cause) {
      return Promise.reject(
        new PdfModuleError('WORKER_TRANSPORT', 'Could not create PDF worker', { cause }),
      );
    }

    return new Promise<Result>((resolve, reject) => {
      this.pendingRequests.set(request.id, { resolve, reject, onProgress });
      try {
        worker.postMessage(request);
      } catch (cause) {
        this.pendingRequests.delete(request.id);
        reject(new PdfModuleError('WORKER_TRANSPORT', 'Could not send request to PDF worker', { cause }));
      }
    });
  }

  private getWorker(): PdfWorkerLike {
    if (this.worker) return this.worker;
    const worker = this.workerFactory();
    worker.onmessage = event => this.handleMessage(event.data);
    worker.onerror = event => {
      this.handleTransportFailure(event.error ?? new Error(event.message || 'PDF worker error'));
    };
    worker.onmessageerror = () => {
      this.handleTransportFailure(new Error('PDF worker response could not be deserialized'));
    };
    this.worker = worker;
    return worker;
  }

  private handleMessage(response: PdfWorkerResponse): void {
    const pending = this.pendingRequests.get(response.id);
    if (!pending) return;
    if ('type' in response && response.type === 'progress') {
      pending.onProgress?.(response.progress);
      return;
    }
    this.pendingRequests.delete(response.id);
    if ('success' in response && response.success === true) {
      pending.resolve(response.result);
    } else if ('success' in response && response.success === false) {
      pending.reject(deserializePdfError(response.error));
    }
  }

  private handleTransportFailure(cause: unknown): void {
    this.worker?.terminate();
    this.worker = null;
    this.rejectAll(new PdfModuleError('WORKER_TRANSPORT', 'PDF worker failed', { cause }));
  }

  private rejectAll(error: PdfModuleError): void {
    this.pendingRequests.forEach(pending => pending.reject(error));
    this.pendingRequests.clear();
  }
}

export const pdfWorkerClient = new PdfWorkerClient();
