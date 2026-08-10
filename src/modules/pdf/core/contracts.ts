export type PdfMetadata = {
  title?: string;
  author?: string;
  subject?: string;
  keywords?: string;
};

/**
 * The subset of File/Blob used by the processing core. Keeping this structural
 * makes operation modules usable from browsers, workers, and in-memory tests.
 */
export type NamedBinarySource = {
  readonly name: string;
  readonly type?: string;
  readonly size?: number;
  readonly lastModified?: number;
  arrayBuffer(): Promise<ArrayBuffer>;
};

export type BinaryInput = NamedBinarySource | ArrayBuffer | Uint8Array;

export type PageDimensions = {
  width: number;
  height: number;
};

export interface PdfOperationModule<Key extends string, Options, Result> {
  readonly key: Key;
  execute(inputs: readonly BinaryInput[], options: Options): Promise<Result>;
}

export type CropMargins = {
  top: number;
  right: number;
  bottom: number;
  left: number;
};
