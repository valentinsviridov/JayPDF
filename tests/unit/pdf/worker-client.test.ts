import { describe, expect, test } from 'bun:test';
import { PdfModuleError } from '../../../src/modules/pdf/core/errors';
import { PdfWorkerClient, type PdfWorkerLike } from '../../../src/modules/pdf/worker-client';
import type { PdfWorkerRequest, PdfWorkerResponse } from '../../../src/modules/pdf/worker-protocol';

class FakeWorker implements PdfWorkerLike {
  onmessage: ((event: MessageEvent<PdfWorkerResponse>) => void) | null = null;
  onerror: ((event: ErrorEvent) => void) | null = null;
  onmessageerror: ((event: MessageEvent<unknown>) => void) | null = null;
  readonly requests: PdfWorkerRequest[] = [];
  terminated = false;

  postMessage(message: PdfWorkerRequest): void {
    this.requests.push(message);
  }

  terminate(): void {
    this.terminated = true;
  }

  respond(response: PdfWorkerResponse): void {
    this.onmessage?.({ data: response } as MessageEvent<PdfWorkerResponse>);
  }
}

describe('typed worker client lifecycle', () => {
  test('correlates concurrent responses and releases pending entries', async () => {
    const worker = new FakeWorker();
    let nextId = 0;
    const client = new PdfWorkerClient(() => worker, () => `request-${++nextId}`);
    const first = client.runOperation('merge', [], {});
    const second = client.runOperation('merge', [], {});
    expect(client.pendingRequestCount).toBe(2);
    worker.respond({ id: 'request-2', success: true, result: new Uint8Array([2]) });
    worker.respond({ id: 'request-1', success: true, result: new Uint8Array([1]) });
    expect([...await first]).toEqual([1]);
    expect([...await second]).toEqual([2]);
    expect(client.pendingRequestCount).toBe(0);
  });

  test('deserializes operation errors without losing the stable code', async () => {
    const worker = new FakeWorker();
    const client = new PdfWorkerClient(() => worker, () => 'request');
    const result = client.runOperation('split', [], { pagesPerFile: 1 });
    worker.respond({
      id: 'request',
      success: false,
      error: { code: 'INVALID_INPUT', message: 'bad split', operation: 'split' },
    });
    await expect(result).rejects.toBeInstanceOf(PdfModuleError);
    await expect(result).rejects.toThrow(/bad split/);
    expect(client.pendingRequestCount).toBe(0);
  });

  test('rejects every pending request and resets after a transport failure', async () => {
    const firstWorker = new FakeWorker();
    const secondWorker = new FakeWorker();
    let factoryCalls = 0;
    const client = new PdfWorkerClient(
      () => factoryCalls++ === 0 ? firstWorker : secondWorker,
      () => `request-${factoryCalls}`,
    );
    const pending = client.getPageCount({} as File);
    firstWorker.onerror?.({ error: new Error('worker crashed'), message: 'worker crashed' } as ErrorEvent);
    await expect(pending).rejects.toThrow(/worker failed/i);
    expect(firstWorker.terminated).toBe(true);
    expect(client.pendingRequestCount).toBe(0);

    const recovered = client.getPageCount({} as File);
    secondWorker.respond({ id: 'request-1', success: true, result: 7 });
    expect(await recovered).toBe(7);
  });
});
