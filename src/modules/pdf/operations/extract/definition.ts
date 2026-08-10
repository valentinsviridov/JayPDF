export type ExtractOptions = {
  pagesToExtract?: number[];
  preserveMetadata?: boolean;
};

export const DEFAULT_EXTRACT_OPTIONS: ExtractOptions = {
  preserveMetadata: true,
};
