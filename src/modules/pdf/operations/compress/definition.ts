export type CompressionLevel = 'low' | 'medium' | 'high';

export type CompressOptions = {
  compressionLevel?: CompressionLevel;
  preserveMetadata?: boolean;
  stripAnnotations?: boolean;
  downscaleImages?: boolean;
  downscaleImagesDpi?: number;
  imageQuality?: number;
};

export type CompressionResult = {
  data: Uint8Array;
  originalSize: number;
  processedSize: number;
  compressionRatio: number;
  processingTimeMs: number;
  universalOptimizedCount?: number;
};

export const COMPRESSION_PRESETS: Record<CompressionLevel, CompressOptions> = {
  low: {
    compressionLevel: 'low',
    preserveMetadata: true,
    stripAnnotations: false,
    downscaleImages: false,
    downscaleImagesDpi: 150,
  },
  medium: {
    compressionLevel: 'medium',
    preserveMetadata: true,
    stripAnnotations: false,
    downscaleImages: true,
    downscaleImagesDpi: 150,
  },
  high: {
    compressionLevel: 'high',
    preserveMetadata: false,
    stripAnnotations: true,
    downscaleImages: true,
    downscaleImagesDpi: 72,
  },
};

export const DEFAULT_COMPRESS_OPTIONS: CompressOptions = {
  ...COMPRESSION_PRESETS.medium,
  preserveMetadata: false,
};
