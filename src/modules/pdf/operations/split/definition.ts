export type SplitOptions = {
  pagesPerFile?: number;
  autoRepairCorrupted?: boolean;
};

export const DEFAULT_SPLIT_OPTIONS: SplitOptions = {
  pagesPerFile: 1,
  autoRepairCorrupted: false,
};
