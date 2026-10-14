import { describe, expect, test } from 'bun:test';
import { saveAndroidDocument, EXPORT_CHUNK_SIZE, MAX_ANDROID_EXPORT_BYTES, type AndroidDocumentsBridge } from '../../src/modules/pdf/android-download';

function fakeBridge(options: { cancel?: boolean; failChunk?: boolean } = {}) {
  const messages: Record<string, any>[] = [];
  const received: Uint8Array[] = [];
  const bridge: AndroidDocumentsBridge = {
    onmessage: null,
    postMessage(raw) {
      const command = JSON.parse(raw);
      messages.push(command);
      if (command.action === 'chunk') received.push(Uint8Array.from(atob(command.data), char => char.charCodeAt(0)));
      if (command.action === 'abort') return;
      queueMicrotask(() => bridge.onmessage?.({ data: JSON.stringify({
        id: command.id,
        cancelled: command.action === 'finish' && options.cancel,
        error: command.action === 'chunk' && options.failChunk ? 'Storage full' : undefined,
      }) }));
    },
  };
  return { bridge, messages, received };
}

describe('Android document export', () => {
  test('preserves arbitrary PDF/ZIP bytes across bounded chunks and waits for each acknowledgement', async () => {
    const bytes = Uint8Array.from({ length: EXPORT_CHUNK_SIZE * 2 + 37 }, (_, index) => index % 256);
    const { bridge, messages, received } = fakeBridge();
    expect(await saveAndroidDocument({ blob: new Blob([bytes], { type: 'application/zip' }), fileName: 'pages.zip' }, bridge)).toBe('saved');
    expect(messages.map(message => message.action)).toEqual(['begin', 'chunk', 'chunk', 'chunk', 'finish']);
    expect(messages[0].fileName).toBe('pages.zip');
    expect(messages[0].mimeType).toBe('application/zip');
    expect(messages[0].size).toBe(bytes.length);
    const result = new Uint8Array(bytes.length);
    let offset = 0;
    received.forEach(chunk => { expect(chunk.length <= EXPORT_CHUNK_SIZE).toBe(true); result.set(chunk, offset); offset += chunk.length; });
    expect(result).toEqual(bytes);
    expect(bridge.onmessage).toBe(null);
  });

  test('cancellation is a normal result, and a subsequent save succeeds', async () => {
    const artifact = { blob: new Blob(['pdf']), fileName: 'document.pdf' };
    expect(await saveAndroidDocument(artifact, fakeBridge({ cancel: true }).bridge)).toBe('cancelled');
    expect(await saveAndroidDocument(artifact, fakeBridge().bridge)).toBe('saved');
  });

  test('storage errors abort staged data without offering a corrupt output', async () => {
    const { bridge, messages } = fakeBridge({ failChunk: true });
    await expect(saveAndroidDocument({ blob: new Blob(['pdf']), fileName: 'document.pdf' }, bridge)).rejects.toThrow('Storage full');
    expect(messages.map(message => message.action)).toEqual(['begin', 'chunk', 'abort']);
    expect(bridge.onmessage).toBe(null);
  });

  test('rejects oversize exports before sending any document data', async () => {
    const { bridge, messages } = fakeBridge();
    const blob = { size: MAX_ANDROID_EXPORT_BYTES + 1 } as Blob;
    await expect(saveAndroidDocument({ blob, fileName: 'large.pdf' }, bridge)).rejects.toThrow('512 MB');
    expect(messages).toHaveLength(0);
  });
});
