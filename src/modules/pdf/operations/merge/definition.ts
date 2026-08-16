import type { PdfMetadata } from '../../core/contracts';

export type MergeOptions = {
  metadata?: PdfMetadata;
  addPageDividers?: boolean;
  autoRepairCorrupted?: boolean;
};

export const DEFAULT_MERGE_OPTIONS: MergeOptions = {
  addPageDividers: false,
  autoRepairCorrupted: false,
};
