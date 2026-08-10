"use client";

import { useDictionary } from '../../../../i18n/LocaleProvider';
import type { PageOrientation, PageSize } from '../../../../modules/pdf/operations/images-to-pdf/definition';
import type { FeatureOptionsProps } from './shared';

export function ImagesToPdfOptions({ options, onOptionsChangeAction }: FeatureOptionsProps) {
  const strings = useDictionary().components.processingOptions.imagesToPdf;
  const fit = options.imageFit ?? 'contain';
  const size = options.pageSize ?? 'auto';
  const orientation = options.pageOrientation ?? 'auto';
  const margin = options.pageMarginPoints ?? 18;
  const background = options.backgroundColor ?? '#ffffff';

  return (
    <div className="mt-4 space-y-6">
      <div>
        <h3 className="text-sm font-semibold text-[var(--tx)]">{strings.title}</h3>
        <p className="mt-1 text-xs text-[var(--tx-3)]">{strings.layoutTitle}</p>
      </div>

      <div>
        <p className="text-xs font-medium text-[var(--tx-2)]">{strings.fitLabel}</p>
        <div className="mt-2 flex flex-wrap gap-2" role="radiogroup" aria-label={strings.fitLabel}>
          {(['contain', 'cover'] as const).map(candidate => {
            const selected = fit === candidate;
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
                  name="image-fit"
                  className="sr-only"
                  checked={selected}
                  onChange={() => onOptionsChangeAction({ ...options, imageFit: candidate })}
                />
                <span>{strings.fitOptions[candidate]}</span>
              </label>
            );
          })}
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-[var(--tx-2)]" htmlFor="page-size">
          {strings.sizeLabel}
        </label>
        <select
          id="page-size"
          className="mt-1 w-full rounded-md border border-[var(--ui-2)] bg-white px-2 py-2 text-sm"
          value={size}
          onChange={event => onOptionsChangeAction({
            ...options,
            pageSize: event.target.value as PageSize,
          })}
        >
          {(Object.keys(strings.sizeOptions) as PageSize[]).map(key => (
            <option key={key} value={key}>{strings.sizeOptions[key]}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-xs font-medium text-[var(--tx-2)]" htmlFor="page-orientation">
          {strings.orientationLabel}
        </label>
        <select
          id="page-orientation"
          className="mt-1 w-full rounded-md border border-[var(--ui-2)] bg-white px-2 py-2 text-sm"
          value={orientation}
          onChange={event => onOptionsChangeAction({
            ...options,
            pageOrientation: event.target.value as PageOrientation,
          })}
        >
          {(Object.keys(strings.orientationOptions) as PageOrientation[]).map(key => (
            <option key={key} value={key}>{strings.orientationOptions[key]}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-xs font-medium text-[var(--tx-2)]" htmlFor="page-margin">
          {strings.marginLabel}
        </label>
        <input
          id="page-margin"
          type="number"
          min={0}
          max={144}
          step={6}
          value={margin}
          onChange={event => onOptionsChangeAction({
            ...options,
            pageMarginPoints: Math.max(0, Number(event.target.value) || 0),
          })}
          className="mt-1 w-full rounded-md border border-[var(--ui-2)] bg-white px-2 py-2 text-sm"
        />
        <p className="text-xs text-[var(--tx-3)]">{strings.marginHint}</p>
      </div>

      <div>
        <label className="block text-xs font-medium text-[var(--tx-2)]" htmlFor="background-color">
          {strings.backgroundLabel}
        </label>
        <div className="mt-1 flex items-center gap-3">
          <input
            id="background-color"
            type="color"
            value={background}
            onChange={event => onOptionsChangeAction({ ...options, backgroundColor: event.target.value })}
            className="h-9 w-12 cursor-pointer rounded border border-[var(--ui-2)] bg-transparent"
          />
          <input
            type="text"
            value={background}
            onChange={event => onOptionsChangeAction({ ...options, backgroundColor: event.target.value })}
            className="flex-1 rounded-md border border-[var(--ui-2)] bg-white px-2 py-2 text-sm"
          />
        </div>
        <p className="text-xs text-[var(--tx-3)]">{strings.backgroundHint}</p>
      </div>
    </div>
  );
}
