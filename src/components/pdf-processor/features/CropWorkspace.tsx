"use client";

import { useDictionary } from '../../../i18n/LocaleProvider';
import type { CropMargins } from '../../../modules/pdf/core/contracts';
import { PageSelectionPanels, type PageSelectionPanelsProps } from './PageSelectionPanels';
import UnifiedCropInterface from '../UnifiedCropInterface';

type CropWorkspaceProps = Omit<PageSelectionPanelsProps, 'featureKey' | 'title' | 'rotationDegrees'> & {
  currentFile: File | null;
  previewPage: number;
  hasSelection: boolean;
  cropMargins: CropMargins;
  onCropChange(margins: CropMargins): void;
};

export function CropWorkspace({
  currentFile,
  previewPage,
  hasSelection,
  cropMargins,
  onCropChange,
  ...selectionProps
}: CropWorkspaceProps) {
  const title = useDictionary().components.pdfProcessor.labels.pagesToCrop;
  return (
    <div className="mt-6 space-y-8">
      <PageSelectionPanels {...selectionProps} featureKey="crop" title={title} />
      {currentFile && hasSelection ? (
        <UnifiedCropInterface
          file={currentFile}
          pageNumber={previewPage}
          cropMargins={cropMargins}
          onCropChangeAction={onCropChange}
        />
      ) : null}
    </div>
  );
}
