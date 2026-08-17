"use client";

import { useDictionary } from '../../../../i18n/LocaleProvider';
import type { FeatureOptionsProps } from './shared';
import { OptionToggle } from './shared';

export function RotateOptions({ options, onOptionsChangeAction }: FeatureOptionsProps) {
  const strings = useDictionary().components.processingOptions.crop;
  return (
    <div className="mt-4 space-y-4">
      <OptionToggle
        checked={options.preserveMetadata !== false}
        label={strings.preserveMetadata}
        description={strings.preserveMetadataHint}
        onChange={value => onOptionsChangeAction({ ...options, preserveMetadata: value })}
      />
    </div>
  );
}
