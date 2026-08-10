"use client";

import { useDictionary } from '../../../i18n/LocaleProvider';
import type { ProcessorOptions } from '../../../modules/pdf/operation-map';
import { PageSelectionPanels, type PageSelectionPanelsProps } from './PageSelectionPanels';

type RotateWorkspaceProps = Omit<PageSelectionPanelsProps, 'featureKey' | 'title' | 'rotationDegrees'> & {
  options: ProcessorOptions;
  onOptionsChange(options: ProcessorOptions): void;
};

export function RotateWorkspace({ options, onOptionsChange, ...selectionProps }: RotateWorkspaceProps) {
  const dictionary = useDictionary();
  const title = dictionary.components.pdfProcessor.labels.pagesToRotate;
  const strings = dictionary.components.processingOptions.rotate;
  const rotation = options.rotationDegrees ?? 90;
  const choices = [
    { value: 90 as const, label: strings.rotateRight90 },
    { value: 180 as const, label: strings.rotate180 },
    { value: -90 as const, label: strings.rotateLeft90 },
  ];

  return (
    <div className="mt-6 space-y-8">
      <div className="space-y-3">
        <h3 className="font-bold">{title}</h3>
        <p className="text-sm text-[var(--tx-3)]">{strings.hint}</p>
        <div className="flex flex-wrap gap-2">
          {choices.map(choice => (
            <button
              key={choice.value}
              type="button"
              className={`rounded-lg border px-4 py-2 ${rotation === choice.value
                ? 'border-[var(--accent)] bg-[var(--accent)] text-white'
                : 'border-[var(--ui-2)] bg-white text-[var(--tx)]'
              }`}
              onClick={() => onOptionsChange({ ...options, rotationDegrees: choice.value })}
            >
              {choice.label}
            </button>
          ))}
        </div>
      </div>
      <PageSelectionPanels
        {...selectionProps}
        featureKey="rotate"
        title=""
        rotationDegrees={rotation}
      />
    </div>
  );
}
