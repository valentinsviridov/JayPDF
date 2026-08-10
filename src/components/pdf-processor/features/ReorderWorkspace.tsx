"use client";

import { useDictionary } from '../../../i18n/LocaleProvider';
import PageOrderer from '../PageOrderer';

type ReorderWorkspaceProps = {
  files: File[];
  currentFileIndex: number;
  currentFileKey: string | null;
  pageOrder: number[];
  ordersByFile: Record<string, number[]>;
  buildFileSignature(file: File): string;
  onFileChange(index: number): void;
  onOrderChange(file: File, order: number[]): void;
};

export function ReorderWorkspace({
  files,
  currentFileIndex,
  currentFileKey,
  pageOrder,
  ordersByFile,
  buildFileSignature,
  onFileChange,
  onOrderChange,
}: ReorderWorkspaceProps) {
  const dictionary = useDictionary();
  const title = dictionary.components.pdfProcessor.labels.reorderPages;
  const ordererStrings = dictionary.components.pageOrderer;
  const fileStrings = dictionary.components.fileList;

  return (
    <div className="mt-6 space-y-8">
      <h3 className="font-bold">{title}</h3>
      {files.map((file, index) => {
        const fileKey = buildFileSignature(file);
        const order = fileKey === currentFileKey ? pageOrder : ordersByFile[fileKey] ?? [];
        const active = currentFileIndex === index;
        return (
          <section
            key={`reorder-panel-${fileKey}`}
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
                <p className="max-w-[280px] truncate font-medium text-[var(--tx)] sm:max-w-none">{file.name}</p>
                <p className="text-xs text-[var(--tx-3)]">
                  {order.length > 0 ? ordererStrings.summary(order.length) : ordererStrings.loading}
                </p>
              </div>
              {active ? <span className="text-xs font-medium text-[var(--accent)]">{fileStrings.selected}</span> : null}
            </header>
            <div className="px-4 pb-4 pt-3">
              <PageOrderer
                key={`orderer-${fileKey}`}
                file={file}
                onOrderChangeAction={values => onOrderChange(file, values)}
                initialOrder={order.length > 0 ? order : undefined}
              />
            </div>
          </section>
        );
      })}
    </div>
  );
}
