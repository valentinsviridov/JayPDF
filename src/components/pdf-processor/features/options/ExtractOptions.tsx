"use client";

import { useDictionary } from '../../../../i18n/LocaleProvider';
import type { FeatureOptionsProps } from './shared';
import { AutoRepairToggle, OptionToggle } from './shared';

export function ExtractOptions({ options, onOptionsChangeAction }: FeatureOptionsProps) {
  const strings = useDictionary().components.processingOptions.extract;
  return (
    <div className="mt-4 space-y-4">
      <h3 className="font-medium text-[var(--tx)]">{strings.title}</h3>
      <OptionToggle
        checked={options.preserveMetadata !== false}
        label={strings.preserveMetadata}
        description={strings.preserveMetadataHint}
        onChange={value => onOptionsChangeAction({ ...options, preserveMetadata: value })}
      />
      <AutoRepairToggle
        checked={options.autoRepairCorrupted === true}
        onChange={value => onOptionsChangeAction({ ...options, autoRepairCorrupted: value })}
      />
    </div>
  );
}
