import { downloadOnAndroid } from './android-download';
import { isAndroidApp } from '../../lib/platform';

export type DownloadArtifact = { blob: Blob; fileName: string };
export type SaveOutcome = 'saved' | 'downloaded' | 'cancelled' | 'failed';
export type DownloadOptions = { forceDownload?: boolean };

export interface DownloadService {
  download(artifact: DownloadArtifact, options?: DownloadOptions): Promise<SaveOutcome>;
}

// Keep the optional browser API out of the baseline DOM types and feature-detect at runtime.
export type SaveFilePicker = (options: { suggestedName: string }) => Promise<{
  createWritable(): Promise<{
    write(data: Blob): Promise<void>;
    close(): Promise<void>;
    abort(): Promise<void>;
  }>;
}>;
type SaveWindow = Window & { showSaveFilePicker?: SaveFilePicker };

export const DOWNLOAD_STATUS_EVENT = 'jaypdf:download-status';

export function supportsSaveFilePicker(): boolean {
  return typeof window !== 'undefined' && window.isSecureContext === true
    && typeof (window as SaveWindow).showSaveFilePicker === 'function';
}

function announce(message: string): void {
  window.dispatchEvent(new CustomEvent(DOWNLOAD_STATUS_EVENT, { detail: message }));
}

function isCancellation(error: unknown): boolean {
  return typeof error === 'object' && error !== null && 'name' in error && error.name === 'AbortError';
}

export async function saveWithFilePicker(artifact: DownloadArtifact, picker: SaveFilePicker): Promise<'saved' | 'cancelled'> {
  let handle: Awaited<ReturnType<SaveFilePicker>>;
  try {
    // Must run immediately in the click handler, before any other await or queued task.
    handle = await picker({ suggestedName: artifact.fileName });
  } catch (error) {
    if (isCancellation(error)) return 'cancelled';
    throw error;
  }
  const writable = await handle.createWritable();
  try {
    await writable.write(artifact.blob);
    await writable.close();
    return 'saved';
  } catch (error) {
    // A write failure is not a dismissed picker, even if it is called AbortError.
    // Abort discards staged edits to an existing destination where supported.
    try { await writable.abort(); } catch { /* Preserve the original error. */ }
    throw error;
  }
}

function downloadInBrowser({ blob, fileName }: DownloadArtifact): void {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = fileName;
  // Older Safari may open the document instead. Keep our results tab intact.
  anchor.target = '_blank';
  anchor.rel = 'noopener';
  document.body.appendChild(anchor);
  try { anchor.click(); } finally {
    anchor.remove();
    // Safari/mobile browsers may consume blob URLs after the click handler returns.
    window.setTimeout(() => URL.revokeObjectURL(url), 60_000);
  }
}

export const browserDownloadService: DownloadService = {
  async download(artifact, { forceDownload = false } = {}) {
    try {
      let outcome: SaveOutcome;
      if (isAndroidApp()) {
        announce('Choose where to save your file in the Android file picker.');
        outcome = await downloadOnAndroid(artifact);
      } else if (!forceDownload && supportsSaveFilePicker()) {
        outcome = await saveWithFilePicker(artifact, (window as SaveWindow).showSaveFilePicker!.bind(window));
      } else {
        // Run synchronously from the user's tap, including without the picker API.
        downloadInBrowser(artifact);
        outcome = 'downloaded';
      }
      announce(outcome === 'saved' ? 'File saved.'
        : outcome === 'cancelled' ? 'Save cancelled. Your result is still available.'
        : 'Download requested. Check your browser’s downloads, or save the opened document using its menu.');
      return outcome;
    } catch {
      announce('Could not save the file. Your result is still available. Try again or use Download instead if offered.');
      return 'failed';
    }
  },
};
