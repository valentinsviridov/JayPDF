"use client";

import { useDictionary } from '../../../../i18n/LocaleProvider';
import type { FeatureOptionsProps } from './shared';
import { OptionToggle } from './shared';

export function PdfToImagesOptions({ options, onOptionsChangeAction }: FeatureOptionsProps) {
  const strings = useDictionary().components.processingOptions.pdfToImages;
  const format = options.imageOutputFormat ?? 'png';
  const zipSelected = options.bundleAsZip !== false;
  const quality = options.imageOutputQuality ?? 0.9;
  const dpi = options.imageRenderDpi ?? 144;
  const baseName = options.imageBaseName ?? '';

  return (
    <div className="mt-4 space-y-6">
      <div>
        <h3 className="text-sm font-semibold text-[var(--tx)]">{strings.title}</h3>
        <p className="mt-1 text-xs text-[var(--tx-3)]">{strings.formatHint}</p>
        <div className="mt-3 flex flex-wrap gap-2" role="radiogroup" aria-label={strings.formatLabel}>
          {(['png', 'jpeg'] as const).map(candidate => {
            const selected = format === candidate;
            return (
              <label
                key={candidate}
                className={`cursor-pointer rounded-lg border px-4 py-2 text-sm transition focus-within:ring-2 focus-within:ring-[var(--accent)] ${selected
                  ? 'border-[var(--accent)] bg-[var(--bg-1)] text-[var(--tx)]'
                  : 'border-[var(--ui-2)] bg-[var(--bg-2)] text-[var(--tx-2)] hover:border-[var(--accent)]/60'
                }`}
              >
                <input
                  type="radio"
                  name="image-format"
                  className="sr-only"
                  checked={selected}
                  onChange={() => onOptionsChangeAction({
                    ...options,
                    imageOutputFormat: candidate,
                    imageOutputQuality: candidate === 'jpeg' ? quality : undefined,
                  })}
                />
                <span>{candidate === 'png' ? strings.pngLabel : strings.jpegLabel}</span>
              </label>
            );
          })}
        </div>
      </div>

      {format === 'jpeg' && (
        <div>
          <label className="flex items-center justify-between text-sm font-medium text-[var(--tx-2)]" htmlFor="jpeg-quality">
            <span>{strings.qualityLabel}</span>
            <span className="rounded-full bg-[var(--accent)] px-2 py-0.5 text-xs font-semibold text-white">
              {Math.round(quality * 100)}%
            </span>
          </label>
          <input
            id="jpeg-quality"
            type="range"
            min={0.1}
            max={1}
            step={0.05}
            value={quality}
            onChange={event => onOptionsChangeAction({
              ...options,
              imageOutputQuality: Number(event.target.value),
            })}
            className="mt-2 w-full"
          />
          <p className="text-xs text-[var(--tx-3)]">{strings.qualityHint}</p>
        </div>
      )}

      <div>
        <p className="text-sm font-medium text-[var(--tx-2)]">{strings.dpiLabel}</p>
        <div className="mt-2 flex flex-wrap gap-2" role="radiogroup" aria-label={strings.dpiLabel}>
          {([72, 144, 300] as const).map(preset => {
            const selected = dpi === preset;
            const label = preset === 72
              ? strings.dpiPresets.screen
              : preset === 144 ? strings.dpiPresets.balanced : strings.dpiPresets.print;
            return (
              <label
                key={preset}
                className={`cursor-pointer rounded-lg border px-4 py-2 text-sm transition focus-within:ring-2 focus-within:ring-[var(--accent)] ${selected
                  ? 'border-[var(--accent)] bg-[var(--bg-1)] text-[var(--tx)]'
                  : 'border-[var(--ui-2)] bg-[var(--bg-2)] text-[var(--tx-2)] hover:border-[var(--accent)]/60'
                }`}
              >
                <input
                  type="radio"
                  name="render-dpi"
                  className="sr-only"
                  checked={selected}
                  onChange={() => onOptionsChangeAction({ ...options, imageRenderDpi: preset })}
                />
                <span>{label}</span>
              </label>
            );
          })}
        </div>
        <p className="mt-1 text-xs text-[var(--tx-3)]">{strings.dpiHint}</p>
      </div>

      <div className="space-y-3 rounded-lg border border-[var(--ui-2)] bg-[var(--bg-2)] p-4">
        <OptionToggle
          checked={zipSelected}
          label={strings.zipLabel}
          description={strings.zipHint}
          onChange={value => onOptionsChangeAction({ ...options, bundleAsZip: value })}
        />
        <div>
          <label className="block text-xs font-medium text-[var(--tx-2)]" htmlFor="base-name">
            {strings.baseNameLabel}
          </label>
          <input
            id="base-name"
            type="text"
            placeholder={strings.baseNamePlaceholder}
            value={baseName}
            onChange={event => onOptionsChangeAction({ ...options, imageBaseName: event.target.value })}
            className="mt-1 w-full rounded-md border border-[var(--ui-2)] bg-white px-2 py-2 text-sm"
          />
          <p className="mt-1 text-xs text-[var(--tx-3)]">{strings.baseNameHint}</p>
        </div>
      </div>
    </div>
  );
}
