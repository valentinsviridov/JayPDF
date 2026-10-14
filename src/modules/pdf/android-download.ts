import type { DownloadArtifact } from './download-service';

type NativeReply = { id: string; error?: string; cancelled?: boolean };
export interface AndroidDocumentsBridge {
  postMessage(message: string): void;
  onmessage: ((event: { data: string }) => void) | null;
}

declare global {
  interface Window {
    JayPdfDocuments?: AndroidDocumentsBridge;
  }
}

export const EXPORT_CHUNK_SIZE = 192 * 1024;
export const MAX_ANDROID_EXPORT_BYTES = 512 * 1024 * 1024;

// One picker at a time, including batch results. A cancelled save must not poison the queue.
let queue: Promise<void> = Promise.resolve();

export async function saveAndroidDocument(
  { blob, fileName }: DownloadArtifact,
  bridge: AndroidDocumentsBridge,
): Promise<'saved' | 'cancelled'> {
  if (blob.size > MAX_ANDROID_EXPORT_BYTES) throw new Error('Android exports are limited to 512 MB. Split the document and try again.');
  let sequence = 0;
  const session = crypto.randomUUID();
  const request = (command: Record<string, unknown>, picker = false): Promise<NativeReply> => new Promise((resolve, reject) => {
    const id = `${session}:${++sequence}`;
    // Do not time out a user choosing where to save. Native lifecycle cleanup handles exit.
    const timer = picker ? undefined : setTimeout(() => {
      bridge.onmessage = null;
      reject(new Error('Saving timed out. Please try again.'));
    }, 60_000);
    bridge.onmessage = ({ data }) => {
      let reply: NativeReply;
      try { reply = JSON.parse(data); } catch { return; }
      if (reply.id !== id) return;
      clearTimeout(timer);
      bridge.onmessage = null;
      if (reply.error) reject(new Error(reply.error));
      else resolve(reply);
    };
    try {
      bridge.postMessage(JSON.stringify({ ...command, id, session }));
    } catch (error) {
      clearTimeout(timer);
      bridge.onmessage = null;
      reject(error);
    }
  });

  try {
    await request({ action: 'begin', fileName, mimeType: blob.type || 'application/octet-stream', size: blob.size });
    for (let offset = 0; offset < blob.size; offset += EXPORT_CHUNK_SIZE) {
      const bytes = new Uint8Array(await blob.slice(offset, offset + EXPORT_CHUNK_SIZE).arrayBuffer());
      let binary = '';
      for (let index = 0; index < bytes.length; index += 8192) {
        binary += String.fromCharCode(...bytes.subarray(index, index + 8192));
      }
      await request({ action: 'chunk', data: btoa(binary) });
    }
    const result = await request({ action: 'finish' }, true);
    return result.cancelled ? 'cancelled' : 'saved';
  } catch (error) {
    bridge.postMessage(JSON.stringify({ action: 'abort', session, id: `${session}:abort` }));
    throw error;
  } finally {
    bridge.onmessage = null;
  }
}

export function downloadOnAndroid(artifact: DownloadArtifact): Promise<'saved' | 'cancelled'> {
  const task = queue.then(async () => {
    const bridge = window.JayPdfDocuments;
    if (!bridge) throw new Error('Update Android System WebView to save files.');
    return saveAndroidDocument(artifact, bridge);
  });
  queue = task.then(() => {}, () => {});
  return task;
}
