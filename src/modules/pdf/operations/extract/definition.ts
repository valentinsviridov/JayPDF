export type ExtractOptions = {
  pagesToExtract?: number[];
  preserveMetadata?: boolean;
  autoRepairCorrupted?: boolean;
};

export const DEFAULT_EXTRACT_OPTIONS: ExtractOptions = {
  preserveMetadata: true,
  autoRepairCorrupted: false,
};
