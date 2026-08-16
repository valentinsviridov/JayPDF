export type ReorderOptions = {
  pageOrder?: number[];
  preserveMetadata?: boolean;
  autoRepairCorrupted?: boolean;
};

export const DEFAULT_REORDER_OPTIONS: ReorderOptions = {
  preserveMetadata: true,
  autoRepairCorrupted: false,
};
