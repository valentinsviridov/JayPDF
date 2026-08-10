export type ImageOutputFormat = 'png' | 'jpeg';

export type PdfToImagesOptions = {
  imageOutputFormat?: ImageOutputFormat;
  imageOutputQuality?: number;
  imageRenderDpi?: number;
  imageBaseName?: string;
  bundleAsZip?: boolean;
};

export type PdfToImagesResult =
  | {
      kind: 'zip';
      blob: Blob;
      imageCount: number;
      format: ImageOutputFormat;
      suggestedName: string;
    }
  | {
      kind: 'files';
      files: Array<{ blob: Blob; name: string }>;
      imageCount: number;
      format: ImageOutputFormat;
      suggestedName?: string;
    };

export const DEFAULT_PDF_TO_IMAGES_OPTIONS: PdfToImagesOptions = {
  imageOutputFormat: 'png',
  imageOutputQuality: 0.9,
  imageRenderDpi: 144,
  bundleAsZip: true,
  imageBaseName: 'pdflince_pages',
};
