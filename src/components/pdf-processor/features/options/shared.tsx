"use client";

import type { ProcessorOptions } from '../../../../modules/pdf/operation-map';

export type FeatureOptionsProps = {
  options: ProcessorOptions;
  onOptionsChangeAction: (newOptions: ProcessorOptions) => void;
};

export type OptionToggleProps = {
  label: string;
  description?: string;
  checked: boolean;
  onChange: (value: boolean) => void;
};

import { useDictionary } from '../../../../i18n/LocaleProvider';

export function OptionToggle({ label, description, checked, onChange }: OptionToggleProps) {
  return (
    <label className="flex cursor-pointer items-start gap-3 rounded-md border border-transparent px-2 py-2 transition hover:border-[var(--ui-2)] hover:bg-[var(--bg-1)]">
      <input
        type="checkbox"
        className="mt-1 h-4 w-4 shrink-0 cursor-pointer rounded border-[var(--ui-3)] text-[var(--accent)] focus:ring-[var(--accent)]"
        style={{ accentColor: 'var(--accent)' }}
        checked={checked}
        onChange={event => onChange(event.target.checked)}
      />
      <span className="flex flex-col">
        <span className="text-sm font-medium text-[var(--tx)]">{label}</span>
        {description ? <span className="mt-1 text-xs text-[var(--tx-3)]">{description}</span> : null}
      </span>
    </label>
  );
}

export function AutoRepairToggle({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  const strings = useDictionary().components.processingOptions.autoRepair;
  return (
    <div className="space-y-1.5 pt-2 border-t border-[var(--ui-2)]">
      <OptionToggle
        checked={checked}
        label={strings.label}
        description={strings.description}
        onChange={onChange}
      />
      <div className="ml-7 rounded-md border border-amber-500/20 bg-amber-500/10 p-2.5 text-xs text-amber-700 dark:text-amber-300">
        <p>{strings.note}</p>
      </div>
    </div>
  );
}

