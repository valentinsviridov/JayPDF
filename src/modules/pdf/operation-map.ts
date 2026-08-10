import type { CompressOptions, CompressionResult } from './operations/compress/definition';
import type { CropOptions } from './operations/crop/definition';
import type { ExtractOptions } from './operations/extract/definition';
import type { ImagesToPdfOptions } from './operations/images-to-pdf/definition';
import type { MergeOptions } from './operations/merge/definition';
import type { PdfToImagesOptions, PdfToImagesResult } from './operations/pdf-to-images/definition';
import type { ReorderOptions } from './operations/reorder/definition';
import type { RotateOptions } from './operations/rotate/definition';
import type { SplitOptions } from './operations/split/definition';

export interface PdfOperationMap {
  compress: { options: CompressOptions; result: CompressionResult };
  merge: { options: MergeOptions; result: Uint8Array };
  split: { options: SplitOptions; result: Uint8Array[] };
  extract: { options: ExtractOptions; result: Uint8Array };
  crop: { options: CropOptions; result: Uint8Array };
  rotate: { options: RotateOptions; result: Uint8Array };
  reorder: { options: ReorderOptions; result: Uint8Array };
  pdfToImages: { options: PdfToImagesOptions; result: PdfToImagesResult };
  imagesToPdf: { options: ImagesToPdfOptions; result: Uint8Array };
}

export type PdfOperationKey = keyof PdfOperationMap;
export type PdfOperationOptions<Key extends PdfOperationKey> = PdfOperationMap[Key]['options'];
export type PdfOperationResult<Key extends PdfOperationKey> = PdfOperationMap[Key]['result'];

/** Temporary UI adapter type while mode state is dynamic. Engines never use it. */
export type ProcessorOptions = CompressOptions &
  CropOptions &
  ExtractOptions &
  ImagesToPdfOptions &
  MergeOptions &
  PdfToImagesOptions &
  ReorderOptions &
  RotateOptions &
  SplitOptions;
