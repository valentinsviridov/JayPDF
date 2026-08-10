import type { BinaryInput } from '../core/contracts';
import { PdfModuleError } from '../core/errors';
import { isNamedBinarySource, readBytes } from '../core/input';

export function hasOffscreenCanvas(): boolean {
  return typeof OffscreenCanvas !== 'undefined';
}

export function isOffscreenCanvasInstance(
  canvas: HTMLCanvasElement | OffscreenCanvas,
): canvas is OffscreenCanvas {
  return hasOffscreenCanvas() && canvas instanceof OffscreenCanvas;
}

export function loadImageFromBlob(blob: Blob): Promise<HTMLImageElement> {
  if (typeof document === 'undefined') {
    return Promise.reject(
      new PdfModuleError('UNSUPPORTED_CAPABILITY', 'Image rendering requires a browser document'),
    );
  }

  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(blob);
    const image = new Image();
    image.decoding = 'async';
    image.onload = () => {
      URL.revokeObjectURL(url);
      resolve(image);
    };
    image.onerror = event => {
      URL.revokeObjectURL(url);
      reject(event instanceof ErrorEvent ? event.error : new Error('Failed to load image'));
    };
    image.src = url;
  });
}

export async function inputToBlob(input: BinaryInput, fallbackType = 'application/octet-stream'): Promise<Blob> {
  const bytes = await readBytes(input);
  const type = isNamedBinarySource(input) && input.type ? input.type : fallbackType;
  return new Blob([bytes as BlobPart], { type });
}

export async function canvasToBlob(
  canvas: HTMLCanvasElement | OffscreenCanvas,
  type: string,
  quality?: number,
): Promise<Blob> {
  if (isOffscreenCanvasInstance(canvas)) {
    return canvas.convertToBlob({ type, quality });
  }

  return new Promise((resolve, reject) => {
    canvas.toBlob(blob => {
      if (blob) resolve(blob);
      else reject(new Error(`Could not encode canvas as ${type}`));
    }, type, quality);
  });
}
