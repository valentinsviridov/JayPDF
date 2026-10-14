'use client';

import { useRef, useState } from 'react';
import { Download } from 'lucide-react';
import { isAndroidApp } from '../../lib/platform';
import { supportsSaveFilePicker, type DownloadArtifact, type SaveOutcome } from '../../modules/pdf/download-service';
import { usePdfProcessorServices } from './services';

export default function ResultDownloads({ artifacts }: { artifacts: DownloadArtifact[] }) {
  const { downloads } = usePdfProcessorServices();
  // Results mount after processing on the client. Pick the label before the first paint,
  // so a fast tap cannot activate a picker on a button still labelled Download.
  const [mode] = useState<'download' | 'picker' | 'android'>(() =>
    isAndroidApp() ? 'android' : supportsSaveFilePicker() ? 'picker' : 'download');
  const [busy, setBusy] = useState<number | null>(null);
  const [outcomes, setOutcomes] = useState<Record<number, SaveOutcome>>({});
  const saving = useRef(false);

  const save = async (artifact: DownloadArtifact, index: number, forceDownload = false) => {
    if (saving.current) return;
    saving.current = true;
    setBusy(index);
    try {
      // Invoke directly: awaiting other work here can consume the browser's user gesture.
      const outcome = await downloads.download(artifact, { forceDownload });
      setOutcomes(previous => ({ ...previous, [index]: outcome }));
    } catch {
      setOutcomes(previous => ({ ...previous, [index]: 'failed' }));
    } finally {
      saving.current = false;
      setBusy(null);
    }
  };

  return (
    <section aria-label="Save results" className="mx-auto mb-6 max-w-2xl text-left">
      <p className="mb-4 text-center text-sm text-[var(--tx-2)]">
        {mode === 'download'
          ? 'Your results are ready. Tap Download to save using your browser.'
          : 'Your results are ready. Choose where to save each file.'}
      </p>
      <ul className="space-y-3">
        {artifacts.map((artifact, index) => (
          <li key={`${index}-${artifact.fileName}`} className="rounded-xl border border-[var(--ui-2)] p-4">
            <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
              <span className="min-w-0 flex-1 break-all text-sm text-[var(--tx)]">{artifact.fileName}</span>
              <div className="flex shrink-0 flex-wrap items-center gap-3">
                <button
                  type="button"
                  data-testid="save-result"
                  disabled={busy !== null}
                  onClick={() => save(artifact, index)}
                  className="inline-flex items-center gap-2 rounded-xl bg-[var(--accent)] px-6 py-3 text-sm font-semibold text-white hover:bg-[var(--accent-2)] disabled:cursor-wait disabled:opacity-60"
                >
                  <Download className="h-4 w-4" aria-hidden="true" />
                  {busy === index ? 'Saving…' : mode === 'download' ? 'Download' : 'Save as…'}
                </button>
                {mode === 'picker' && (
                  <button type="button" disabled={busy !== null} onClick={() => save(artifact, index, true)}
                    className="text-sm text-[var(--tx-2)] underline underline-offset-4 disabled:opacity-60">
                    Download instead
                  </button>
                )}
              </div>
            </div>
            {outcomes[index] && (
              <p className="mt-2 text-sm text-[var(--tx-2)]" role="status">
                {outcomes[index] === 'saved' ? 'File saved.'
                  : outcomes[index] === 'cancelled' ? 'Save cancelled. You can try again.'
                  : outcomes[index] === 'downloaded' ? 'Download requested.'
                  : 'Could not save. Try again or use Download instead if offered.'}
              </p>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
