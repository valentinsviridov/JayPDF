"use client";

import { useDictionary } from '../../../../i18n/LocaleProvider';
import type { FeatureOptionsProps } from './shared';

export function MergeOptions({ options, onOptionsChangeAction }: FeatureOptionsProps) {
  const strings = useDictionary().components.processingOptions.merge;
  const metadataTitle = options.metadata?.title ?? '';
  const metadataAuthor = options.metadata?.author ?? '';

  const handleMetadataChange = (field: 'title' | 'author', value: string) => {
    const entries = Object.entries({ ...options.metadata, [field]: value })
      .filter(([, entryValue]) => typeof entryValue === 'string' && entryValue.length > 0);
    onOptionsChangeAction({
      ...options,
      metadata: entries.length > 0
        ? Object.fromEntries(entries) as Record<string, string>
        : undefined,
    });
  };

  return (
    <div className="mt-4 space-y-4">
      <h3 className="font-medium text-[var(--tx)]">{strings.title}</h3>
      <label className="flex cursor-pointer items-center gap-2">
        <input
          type="checkbox"
          className="form-checkbox text-[var(--accent)]"
          style={{ accentColor: 'var(--accent)' }}
          checked={options.addPageDividers ?? false}
          onChange={event => onOptionsChangeAction({
            ...options,
            addPageDividers: event.target.checked,
          })}
        />
        <span className="text-sm text-[var(--tx-2)]">{strings.pageDivider}</span>
      </label>
      <div className="space-y-3 rounded-lg border border-[var(--ui-2)] bg-[var(--bg-2)] p-4">
        <p className="text-xs text-[var(--tx-3)]">{strings.metadataHint}</p>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-1">
            <label className="block text-xs font-medium text-[var(--tx-2)]" htmlFor="merge-metadata-title">
              {strings.metadataTitle}
            </label>
            <input
              id="merge-metadata-title"
              type="text"
              value={metadataTitle}
              onChange={event => handleMetadataChange('title', event.target.value)}
              className="w-full rounded-md border border-[var(--ui-2)] bg-white px-2 py-2 text-sm"
            />
          </div>
          <div className="space-y-1">
            <label className="block text-xs font-medium text-[var(--tx-2)]" htmlFor="merge-metadata-author">
              {strings.metadataAuthor}
            </label>
            <input
              id="merge-metadata-author"
              type="text"
              value={metadataAuthor}
              onChange={event => handleMetadataChange('author', event.target.value)}
              className="w-full rounded-md border border-[var(--ui-2)] bg-white px-2 py-2 text-sm"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
