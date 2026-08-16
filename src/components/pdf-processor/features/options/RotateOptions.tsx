"use client";

import { useDictionary } from '../../../../i18n/LocaleProvider';
import { AutoRepairToggle, OptionToggle, type FeatureOptionsProps } from './shared';

export function RotateOptions({ options, onOptionsChangeAction }: FeatureOptionsProps) {
  const strings = useDictionary().components.processingOptions.crop; // or common
  return (
    <div className="mt-4 space-y-4">
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
