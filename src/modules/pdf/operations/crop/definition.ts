import type { CropMargins, PdfMetadata } from '../../core/contracts';

export type CropOptions = {
  pagesToCrop?: number[];
  cropMargins?: CropMargins;
  preserveMetadata?: boolean;
  metadata?: PdfMetadata;
};

export const DEFAULT_CROP_OPTIONS: CropOptions = {
  preserveMetadata: true,
  cropMargins: { top: 18, right: 18, bottom: 18, left: 18 },
};
