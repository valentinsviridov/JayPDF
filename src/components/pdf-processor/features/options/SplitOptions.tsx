"use client";

import { useDictionary } from '../../../../i18n/LocaleProvider';
import type { FeatureOptionsProps } from './shared';

export function SplitOptions({ options, onOptionsChangeAction }: FeatureOptionsProps) {
  const strings = useDictionary().components.processingOptions.split;
  return (
    <div className="mt-4 space-y-4">
      <h3 className="font-medium text-[var(--tx)]">{strings.title}</h3>
      <div className="space-y-1">
        <label className="block text-sm font-medium text-[var(--tx-2)]" htmlFor="split-pages-per-file">
          {strings.pagesPerFile}
        </label>
        <input
          id="split-pages-per-file"
          type="number"
          min={1}
          className="w-full rounded-md border border-[var(--ui-2)] bg-white p-2"
          value={options.pagesPerFile ?? 1}
          onChange={event => onOptionsChangeAction({
            ...options,
            pagesPerFile: Math.max(1, Number(event.target.value) || 1),
          })}
        />
        <p className="text-xs text-[var(--tx-3)]">{strings.pagesPerFileHint}</p>
      </div>
    </div>
  );
}
