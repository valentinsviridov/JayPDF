"use client";

import { useDictionary } from '../../../../i18n/LocaleProvider';
import {
  COMPRESSION_PRESETS,
  type CompressionLevel,
} from '../../../../modules/pdf/operations/compress/definition';
import type { FeatureOptionsProps } from './shared';
import { AutoRepairToggle, OptionToggle } from './shared';

export function CompressOptions({ options, onOptionsChangeAction }: FeatureOptionsProps) {
  const strings = useDictionary().components.processingOptions.compress;
  const currentLevel: CompressionLevel = options.compressionLevel ?? 'medium';
  const preset = COMPRESSION_PRESETS[currentLevel];
  const removeMetadata = options.preserveMetadata === false;
  const stripAnnotations = options.stripAnnotations === true;
  const downscale = options.downscaleImages === true;
  const downscaleLabel = downscale
    ? `${strings.downscaleImages} (${options.downscaleImagesDpi ?? preset.downscaleImagesDpi ?? 150} DPI)`
    : strings.downscaleImages;
  const activeEnhancements = [
    removeMetadata ? strings.removeMetadata : null,
    stripAnnotations ? strings.stripAnnotations : null,
    downscale ? downscaleLabel : null,
  ].filter(Boolean) as string[];

  const selectLevel = (level: CompressionLevel) => {
    const nextPreset = COMPRESSION_PRESETS[level];
    onOptionsChangeAction({ ...options, ...nextPreset, compressionLevel: level });
  };

  return (
    <div className="mt-4 space-y-6">
      <div className="space-y-2">
        <h3 className="text-sm font-semibold text-[var(--tx)]">{strings.title}</h3>
        <div className="grid gap-3 sm:grid-cols-3" role="radiogroup" aria-label={strings.level}>
          {(['low', 'medium', 'high'] as const).map(level => {
            const selected = currentLevel === level;
            const descriptionKey = `${level}Description` as keyof typeof strings.levels;
            const description = strings.levels[descriptionKey];
            return (
              <label
                key={level}
                className={`cursor-pointer rounded-lg border p-3.5 text-sm transition focus-within:ring-2 focus-within:ring-[var(--accent)] flex flex-col justify-between ${
                  selected
                    ? 'border-[var(--accent)] bg-[var(--bg-1)] text-[var(--tx)] shadow-xs'
                    : 'border-[var(--ui-2)] bg-[var(--bg-2)] text-[var(--tx-2)] hover:border-[var(--accent)]/60'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="font-semibold text-xs sm:text-sm text-[var(--tx)]">
                      {strings.levels[level]}
                    </span>
                    <input
                      type="radio"
                      className="sr-only"
                      name="compression-level"
                      value={level}
                      aria-label={strings.levels[level]}
                      checked={selected}
                      onChange={() => selectLevel(level)}
                    />
                    <span
                      aria-hidden
                      className={`h-2.5 w-2.5 shrink-0 rounded-full ${
                        selected
                          ? 'bg-[var(--accent)]'
                          : 'border border-[var(--ui-3)] bg-transparent'
                      }`}
                    />
                  </div>
                  {description && (
                    <p className="text-xs text-[var(--tx-3)] leading-relaxed">{description}</p>
                  )}
                </div>
              </label>
            );
          })}
        </div>
      </div>

      <div className="rounded-lg border border-[var(--ui-2)] bg-[var(--bg-2)] p-4">
        <div className="mb-4 space-y-1">
          <p className="text-sm font-semibold text-[var(--tx)]">{strings.advancedTitle}</p>
          {activeEnhancements.length > 0 ? (
            <p className="text-xs text-[var(--accent)]">
              {strings.activeLabel} {activeEnhancements.join(' • ')}
            </p>
          ) : (
            <p className="text-xs text-[var(--tx-3)]">{strings.advancedDescription}</p>
          )}
        </div>
        <div className="space-y-3">
          <OptionToggle
            checked={removeMetadata}
            label={strings.removeMetadata}
            description={strings.removeMetadataHint}
            onChange={value => onOptionsChangeAction({
              ...options,
              preserveMetadata: !value,
            })}
          />
          <OptionToggle
            checked={stripAnnotations}
            label={strings.stripAnnotations}
            description={strings.stripAnnotationsHint}
            onChange={value => onOptionsChangeAction({ ...options, stripAnnotations: value })}
          />
          <OptionToggle
            checked={downscale}
            label={downscaleLabel}
            description={strings.downscaleHint}
            onChange={value => onOptionsChangeAction({
              ...options,
              downscaleImages: value,
              downscaleImagesDpi: value
                ? options.downscaleImagesDpi ?? preset.downscaleImagesDpi ?? 150
                : undefined,
            })}
          />
          <AutoRepairToggle
            checked={options.autoRepairCorrupted === true}
            onChange={value => onOptionsChangeAction({ ...options, autoRepairCorrupted: value })}
          />
        </div>
      </div>
    </div>
  );
}
