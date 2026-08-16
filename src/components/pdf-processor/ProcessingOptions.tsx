"use client";

import type { PdfOperationKey, ProcessorOptions } from '../../modules/pdf/operation-map';
import { CompressOptions } from './features/options/CompressOptions';
import { CropOptions } from './features/options/CropOptions';
import { ExtractOptions } from './features/options/ExtractOptions';
import { ImagesToPdfOptions } from './features/options/ImagesToPdfOptions';
import { MergeOptions } from './features/options/MergeOptions';
import { PdfToImagesOptions } from './features/options/PdfToImagesOptions';
import { ReorderOptions } from './features/options/ReorderOptions';
import { RotateOptions } from './features/options/RotateOptions';
import { SplitOptions } from './features/options/SplitOptions';
import type { FeatureOptionsProps } from './features/options/shared';

type ProcessingOptionsProps = FeatureOptionsProps & {
  mode: PdfOperationKey;
};

type OptionsComponent = (props: FeatureOptionsProps) => React.ReactNode;

const OPTIONS_COMPONENTS: Partial<Record<PdfOperationKey, OptionsComponent>> = {
  compress: CompressOptions,
  merge: MergeOptions,
  split: SplitOptions,
  extract: ExtractOptions,
  crop: CropOptions,
  reorder: ReorderOptions,
  rotate: RotateOptions,
  pdfToImages: PdfToImagesOptions,
  imagesToPdf: ImagesToPdfOptions,
};

export default function ProcessingOptions({
  mode,
  options,
  onOptionsChangeAction,
}: ProcessingOptionsProps) {
  const Component = OPTIONS_COMPONENTS[mode];
  if (!Component) return null;
  return (
    <Component
      options={options as ProcessorOptions}
      onOptionsChangeAction={onOptionsChangeAction}
    />
  );
}
