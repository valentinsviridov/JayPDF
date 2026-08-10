export type ImageFit = 'contain' | 'cover';
export type PageSize = 'auto' | 'a4' | 'letter';
export type PageOrientation = 'auto' | 'portrait' | 'landscape';

export type ImagesToPdfOptions = {
  imageFit?: ImageFit;
  pageSize?: PageSize;
  pageOrientation?: PageOrientation;
  pageMarginPoints?: number;
  backgroundColor?: string;
};

export const DEFAULT_IMAGES_TO_PDF_OPTIONS: ImagesToPdfOptions = {
  imageFit: 'contain',
  pageSize: 'auto',
  pageOrientation: 'auto',
  pageMarginPoints: 18,
  backgroundColor: '#ffffff',
};
