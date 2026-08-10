export type ReorderOptions = {
  pageOrder?: number[];
  preserveMetadata?: boolean;
};

export const DEFAULT_REORDER_OPTIONS: ReorderOptions = {
  preserveMetadata: true,
};
