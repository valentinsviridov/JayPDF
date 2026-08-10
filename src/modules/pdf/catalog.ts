import { DEFAULT_COMPRESS_OPTIONS } from './operations/compress/definition';
import { DEFAULT_CROP_OPTIONS } from './operations/crop/definition';
import { DEFAULT_EXTRACT_OPTIONS } from './operations/extract/definition';
import { DEFAULT_IMAGES_TO_PDF_OPTIONS } from './operations/images-to-pdf/definition';
import { DEFAULT_MERGE_OPTIONS } from './operations/merge/definition';
import { DEFAULT_PDF_TO_IMAGES_OPTIONS } from './operations/pdf-to-images/definition';
import { DEFAULT_REORDER_OPTIONS } from './operations/reorder/definition';
import { DEFAULT_ROTATE_OPTIONS } from './operations/rotate/definition';
import { DEFAULT_SPLIT_OPTIONS } from './operations/split/definition';
import type { PdfOperationKey, ProcessorOptions } from './operation-map';

export type PdfInputKind = 'pdf' | 'image';

export type PdfFeatureDefinition = {
  key: PdfOperationKey;
  inputKind: PdfInputKind;
  minimumFiles: number;
  orderMatters: boolean;
  pageInteraction?: 'select' | 'reorder';
  defaults: ProcessorOptions;
};

const asProcessorOptions = (options: object): ProcessorOptions => options as ProcessorOptions;

export const PDF_FEATURES: Record<PdfOperationKey, PdfFeatureDefinition> = {
  merge: {
    key: 'merge', inputKind: 'pdf', minimumFiles: 2, orderMatters: true,
    defaults: asProcessorOptions(DEFAULT_MERGE_OPTIONS),
  },
  compress: {
    key: 'compress', inputKind: 'pdf', minimumFiles: 1, orderMatters: false,
    defaults: asProcessorOptions(DEFAULT_COMPRESS_OPTIONS),
  },
  split: {
    key: 'split', inputKind: 'pdf', minimumFiles: 1, orderMatters: false,
    defaults: asProcessorOptions(DEFAULT_SPLIT_OPTIONS),
  },
  extract: {
    key: 'extract', inputKind: 'pdf', minimumFiles: 1, orderMatters: false, pageInteraction: 'select',
    defaults: asProcessorOptions(DEFAULT_EXTRACT_OPTIONS),
  },
  crop: {
    key: 'crop', inputKind: 'pdf', minimumFiles: 1, orderMatters: false, pageInteraction: 'select',
    defaults: asProcessorOptions(DEFAULT_CROP_OPTIONS),
  },
  reorder: {
    key: 'reorder', inputKind: 'pdf', minimumFiles: 1, orderMatters: false, pageInteraction: 'reorder',
    defaults: asProcessorOptions(DEFAULT_REORDER_OPTIONS),
  },
  rotate: {
    key: 'rotate', inputKind: 'pdf', minimumFiles: 1, orderMatters: false, pageInteraction: 'select',
    defaults: asProcessorOptions(DEFAULT_ROTATE_OPTIONS),
  },
  pdfToImages: {
    key: 'pdfToImages', inputKind: 'pdf', minimumFiles: 1, orderMatters: false,
    defaults: asProcessorOptions(DEFAULT_PDF_TO_IMAGES_OPTIONS),
  },
  imagesToPdf: {
    key: 'imagesToPdf', inputKind: 'image', minimumFiles: 1, orderMatters: true,
    defaults: asProcessorOptions(DEFAULT_IMAGES_TO_PDF_OPTIONS),
  },
};

export const PDF_FEATURE_KEYS = Object.keys(PDF_FEATURES) as PdfOperationKey[];

const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp', '.tiff', '.tif'];

export function isPdfFile(file: Pick<File, 'name' | 'type'>): boolean {
  return file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
}

export function isImageFile(file: Pick<File, 'name' | 'type'>): boolean {
  if (file.type.startsWith('image/')) return true;
  const lowerName = file.name.toLowerCase();
  return IMAGE_EXTENSIONS.some(extension => lowerName.endsWith(extension));
}

export function acceptsFile(key: PdfOperationKey, file: Pick<File, 'name' | 'type'>): boolean {
  return PDF_FEATURES[key].inputKind === 'image' ? isImageFile(file) : isPdfFile(file);
}
