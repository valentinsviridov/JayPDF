"use client";

import { useDictionary } from '../../../i18n/LocaleProvider';
import { PageSelectionPanels, type PageSelectionPanelsProps } from './PageSelectionPanels';

type ExtractWorkspaceProps = Omit<PageSelectionPanelsProps, 'featureKey' | 'title' | 'rotationDegrees'>;

export function ExtractWorkspace(props: ExtractWorkspaceProps) {
  const title = useDictionary().components.pdfProcessor.labels.pagesToExtract;
  return (
    <div className="mt-6">
      <PageSelectionPanels {...props} featureKey="extract" title={title} />
    </div>
  );
}
