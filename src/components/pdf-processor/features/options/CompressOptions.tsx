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
        <div className="grid gap-2 sm:grid-cols-3" role="radiogroup" aria-label={strings.level}>
          {(['low', 'medium', 'high'] as const).map(level => {
            const selected = currentLevel === level;
            return (
              <label
                key={level}
                className={`cursor-pointer rounded-lg border px-4 py-3 text-sm transition focus-within:ring-2 focus-within:ring-[var(--accent)] ${selected
                  ? 'border-[var(--accent)] bg-[var(--bg-1)] text-[var(--tx)]'
                  : 'border-[var(--ui-2)] bg-[var(--bg-2)] text-[var(--tx-2)] hover:border-[var(--accent)]/60'
                }`}
              >
                <span className="flex items-center justify-between gap-2">
                  <span className="font-medium">{strings.levels[level]}</span>
                  <input
                    type="radio"
                    className="sr-only"
                    name="compression-level"
                    checked={selected}
                    onChange={() => selectLevel(level)}
                  />
                  <span
                    aria-hidden
                    className={`h-2 w-2 rounded-full ${selected
                      ? 'bg-[var(--accent)]'
                      : 'border border-[var(--ui-3)] bg-transparent'
                    }`}
                  />
                </span>
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
