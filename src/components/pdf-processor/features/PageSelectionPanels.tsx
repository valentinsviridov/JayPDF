"use client";

import { useDictionary } from '../../../i18n/LocaleProvider';
import type { RotationDegrees } from '../../../modules/pdf/operations/rotate/definition';
import PageSelector from '../PageSelector';

export type PageSelectionPanelsProps = {
  featureKey: 'extract' | 'crop' | 'rotate';
  title?: string;
  files: File[];
  currentFileIndex: number;
  currentFileKey: string | null;
  selectedPages: Record<number, boolean>;
  selectionsByFile: Record<string, Record<number, boolean>>;
  buildFileSignature(file: File): string;
  onFileChange(index: number): void;
  onPageSelection(file: File, page: number, selected: boolean): void;
  rotationDegrees?: RotationDegrees;
};

export function PageSelectionPanels({
  featureKey,
  title,
  files,
  currentFileIndex,
  currentFileKey,
  selectedPages,
  selectionsByFile,
  buildFileSignature,
  onFileChange,
  onPageSelection,
  rotationDegrees,
}: PageSelectionPanelsProps) {
  const dictionary = useDictionary();
  const fileStrings = dictionary.components.fileList;
  const errorStrings = dictionary.components.pdfProcessor.errors;

  return (
    <div className="space-y-8">
      {title ? <h3 className="font-bold">{title}</h3> : null}
      {files.map((file, index) => {
        const fileKey = buildFileSignature(file);
        const selection = fileKey === currentFileKey
          ? selectedPages
          : selectionsByFile[fileKey] ?? {};
        const selectedCount = Object.values(selection).filter(Boolean).length;
        const active = currentFileIndex === index;

        return (
          <section
            key={`${featureKey}-panel-${fileKey}`}
            className={`rounded-lg border border-[var(--ui-2)] bg-[var(--bg-2)]/60 shadow-sm transition hover:border-[var(--accent)] ${active ? 'ring-1 ring-[var(--accent)]/60' : ''}`}
          >
            <header
              className="flex cursor-pointer flex-wrap items-center justify-between gap-3 border-b border-[var(--ui-2)] bg-white/70 px-4 py-3"
              onClick={() => onFileChange(index)}
              role="button"
              tabIndex={0}
              onKeyDown={event => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault();
                  onFileChange(index);
                }
              }}
            >
              <div>
                <p className="max-w-[280px] truncate font-medium text-[var(--tx)] sm:max-w-none">
                  {file.name}
                </p>
                <p className="text-xs text-[var(--tx-3)]">
                  {selectedCount > 0
                    ? `${fileStrings.pagesLabel(selectedCount)} • ${fileStrings.selected}`
                    : errorStrings.noPagesSelected}
                </p>
              </div>
              {active ? (
                <span className="text-xs font-medium text-[var(--accent)]">{fileStrings.selected}</span>
              ) : null}
            </header>
            <div className="px-4 pb-4 pt-3">
              <PageSelector
                key={`${featureKey}-selector-${fileKey}`}
                file={file}
                selectedPages={selection}
                onPageSelectAction={(page, value) => onPageSelection(file, page, value)}
                selectedPageRotationDegrees={rotationDegrees}
              />
            </div>
          </section>
        );
      })}
    </div>
  );
}
