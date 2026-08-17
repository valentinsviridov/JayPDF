"use client";

import { useDictionary } from '../../../../i18n/LocaleProvider';
import type { FeatureOptionsProps } from './shared';

export function ReorderOptions({}: FeatureOptionsProps) {
  const strings = useDictionary().components.processingOptions.reorder;
  return (
    <div className="mt-4 space-y-4">
      <div className="space-y-2">
        <h3 className="font-medium text-[var(--tx)]">{strings.title}</h3>
        <p className="text-xs text-[var(--tx-3)]">{strings.hint}</p>
      </div>
    </div>
  );
}
