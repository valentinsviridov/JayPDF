import type { PdfMetadata } from '../../core/contracts';

export type RotationDegrees = 90 | 180 | 270 | -90 | -180 | -270;

export type RotateOptions = {
  pagesToRotate?: number[];
  rotationDegrees?: RotationDegrees;
  preserveMetadata?: boolean;
  metadata?: PdfMetadata;
  autoRepairCorrupted?: boolean;
};

export const DEFAULT_ROTATE_OPTIONS: RotateOptions = {
  preserveMetadata: true,
  rotationDegrees: 90,
  autoRepairCorrupted: false,
};
