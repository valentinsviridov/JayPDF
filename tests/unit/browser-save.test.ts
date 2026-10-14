import { describe, expect, test } from 'bun:test';
import { saveWithFilePicker, type SaveFilePicker } from '../../src/modules/pdf/download-service';

describe('save picker lifecycle', () => {
  test('opens the picker synchronously with the filename and resolves only after closing the stream', async () => {
    const events: string[] = [];
    let received: Blob;
    const artifact = { blob: new Blob([new Uint8Array([0, 255, 37, 80, 68, 70])]), fileName: 'résultat.pdf' };
    const promise = saveWithFilePicker(artifact, async options => {
      expect(options.suggestedName).toBe(artifact.fileName);
      events.push('picker');
      return { createWritable: async () => ({
        write: async blob => { received = blob; events.push('write'); },
        close: async () => { events.push('close'); },
        abort: async () => { events.push('abort'); },
      }) };
    });
    expect(events).toEqual(['picker']);
    expect(await promise).toBe('saved');
    expect(received).toBe(artifact.blob);
    expect(events).toEqual(['picker', 'write', 'close']);
  });

  test('dismissal is cancellation, but a permission denial remains a failure', async () => {
    const artifact = { blob: new Blob(['pdf']), fileName: 'test.pdf' };
    const cancel: SaveFilePicker = async () => { throw new DOMException('Cancelled', 'AbortError'); };
    const denied: SaveFilePicker = async () => { throw new DOMException('Denied', 'NotAllowedError'); };
    expect(await saveWithFilePicker(artifact, cancel)).toBe('cancelled');
    await expect(saveWithFilePicker(artifact, denied)).rejects.toThrow('Denied');
  });

  for (const failure of ['write', 'close']) {
    test(`${failure} failure aborts staged bytes and is not reported as a cancelled or saved file`, async () => {
      let aborted = false;
      const picker: SaveFilePicker = async () => ({ createWritable: async () => ({
        write: async () => { if (failure === 'write') throw new DOMException('Storage failed', 'AbortError'); },
        close: async () => { if (failure === 'close') throw new Error('Storage failed'); },
        abort: async () => { aborted = true; },
      }) });
      await expect(saveWithFilePicker({ blob: new Blob(['pdf']), fileName: 'test.pdf' }, picker)).rejects.toThrow('Storage failed');
      expect(aborted).toBe(true);
    });
  }
});
