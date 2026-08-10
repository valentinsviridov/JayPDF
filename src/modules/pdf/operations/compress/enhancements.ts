import {
  PDFArray,
  PDFDict,
  PDFDocument,
  PDFName,
  PDFNumber,
  PDFRawStream,
  PDFRef,
} from 'pdf-lib';
import { loadImageFromBlob } from '../../infrastructure/browser-images';

export type CompressionEnhancementPlan = {
  removeMetadata: boolean;
  stripAnnotations: boolean;
  downscaleImages: boolean;
  targetDpi: number;
  imageQuality: number;
};

export async function applyCompressionEnhancements(
  pdfDoc: PDFDocument,
  plan: CompressionEnhancementPlan,
): Promise<{ universalOptimizedCount: number }> {
  if (plan.removeMetadata) removeDocumentMetadata(pdfDoc);
  if (plan.stripAnnotations) stripPageAnnotations(pdfDoc);
  const universalOptimizedCount = plan.downscaleImages
    ? await downscaleDocumentImages(pdfDoc, plan.targetDpi, plan.imageQuality)
    : 0;
  return { universalOptimizedCount };
}

function removeDocumentMetadata(pdfDoc: PDFDocument): void {
  const metadataKey = PDFName.of('Metadata');
  const context = pdfDoc.context;
  const infoEntry = context.trailerInfo.Info;

  if (infoEntry instanceof PDFRef) {
    const infoDictionary = context.lookupMaybe(infoEntry, PDFDict);
    infoDictionary?.keys().forEach(key => infoDictionary.delete(key));
    context.delete(infoEntry);
  } else if (infoEntry instanceof PDFDict) {
    infoEntry.keys().forEach(key => infoEntry.delete(key));
    const reference = context.getObjectRef(infoEntry);
    if (reference) context.delete(reference);
  }
  context.trailerInfo.Info = undefined;

  const metadataEntry = pdfDoc.catalog.get(metadataKey);
  if (metadataEntry instanceof PDFRef) context.delete(metadataEntry);
  if (metadataEntry) pdfDoc.catalog.delete(metadataKey);
}

function stripPageAnnotations(pdfDoc: PDFDocument): void {
  const annotationsKey = PDFName.of('Annots');
  const typeKey = PDFName.of('Type');
  const pageKey = PDFName.of('Page');
  pdfDoc.context.enumerateIndirectObjects().forEach(([, object]) => {
    if (object instanceof PDFDict && object.get(typeKey) === pageKey) {
      object.delete(annotationsKey);
    }
  });
}

export async function decompressFlateStream(bytes: Uint8Array): Promise<Uint8Array | null> {
  if (typeof DecompressionStream === 'undefined') return null;
  try {
    const compressed = new Blob([bytes as BlobPart]).stream();
    const decompressed = compressed.pipeThrough(new DecompressionStream('deflate'));
    return new Uint8Array(await new Response(decompressed).arrayBuffer());
  } catch {
    return null;
  }
}

function unfilterPng(
  bytes: Uint8Array,
  width: number,
  height: number,
  bytesPerPixel: number,
): Uint8Array {
  const rowSize = width * bytesPerPixel + 1;
  const result = new Uint8Array(width * height * bytesPerPixel);

  for (let row = 0; row < height; row += 1) {
    const rowStart = row * rowSize;
    if (rowStart + rowSize > bytes.length) break;
    const filter = bytes[rowStart];
    const outputStart = row * width * bytesPerPixel;

    for (let column = 0; column < width * bytesPerPixel; column += 1) {
      const current = bytes[rowStart + 1 + column];
      const left = column >= bytesPerPixel ? result[outputStart + column - bytesPerPixel] : 0;
      const up = row > 0 ? result[outputStart - width * bytesPerPixel + column] : 0;
      const upLeft = row > 0 && column >= bytesPerPixel
        ? result[outputStart - width * bytesPerPixel + column - bytesPerPixel]
        : 0;
      let value: number;

      switch (filter) {
        case 0:
          value = current;
          break;
        case 1:
          value = (current + left) % 256;
          break;
        case 2:
          value = (current + up) % 256;
          break;
        case 3:
          value = (current + Math.floor((left + up) / 2)) % 256;
          break;
        case 4: {
          const predictor = left + up - upLeft;
          const leftDistance = Math.abs(predictor - left);
          const upDistance = Math.abs(predictor - up);
          const upLeftDistance = Math.abs(predictor - upLeft);
          const nearest = leftDistance <= upDistance && leftDistance <= upLeftDistance
            ? left
            : upDistance <= upLeftDistance ? up : upLeft;
          value = (current + nearest) % 256;
          break;
        }
        default:
          value = current;
      }
      result[outputStart + column] = value;
    }
  }
  return result;
}

type RawImageParameters = { width: number; height: number; colorSpace: string };
type DownscaledImage = { bytes: Uint8Array; width: number; height: number };

function isImageBitmapInstance(source: unknown): source is ImageBitmap {
  return typeof ImageBitmap !== 'undefined' && source instanceof ImageBitmap;
}

function isImageDataInstance(source: unknown): source is ImageData {
  return typeof ImageData !== 'undefined' && source instanceof ImageData;
}

async function downscaleImage(
  bytes: Uint8Array,
  targetDpi: number,
  quality: number,
  rawParameters?: RawImageParameters,
): Promise<DownscaledImage | null> {
  const hasDocument = typeof document !== 'undefined';
  const hasOffscreenCanvas = typeof OffscreenCanvas !== 'undefined';
  if (!hasDocument && !hasOffscreenCanvas) return null;

  let width = 0;
  let height = 0;
  let source: ImageBitmap | HTMLImageElement | ImageData | null = null;

  try {
    if (rawParameters) {
      const { width: rawWidth, height: rawHeight, colorSpace } = rawParameters;
      width = rawWidth;
      height = rawHeight;
      let rgba: Uint8ClampedArray;
      if (colorSpace === 'DeviceRGB') {
        rgba = new Uint8ClampedArray(width * height * 4);
        for (let pixel = 0; pixel < width * height; pixel += 1) {
          rgba[pixel * 4] = bytes[pixel * 3];
          rgba[pixel * 4 + 1] = bytes[pixel * 3 + 1];
          rgba[pixel * 4 + 2] = bytes[pixel * 3 + 2];
          rgba[pixel * 4 + 3] = 255;
        }
      } else if (colorSpace === 'DeviceGray') {
        rgba = new Uint8ClampedArray(width * height * 4);
        for (let pixel = 0; pixel < width * height; pixel += 1) {
          const gray = bytes[pixel];
          rgba[pixel * 4] = gray;
          rgba[pixel * 4 + 1] = gray;
          rgba[pixel * 4 + 2] = gray;
          rgba[pixel * 4 + 3] = 255;
        }
      } else {
        return null;
      }
      source = new ImageData(rgba as Uint8ClampedArray<ArrayBuffer>, width, height);
    } else {
      const blob = new Blob([bytes as BlobPart], { type: 'image/jpeg' });
      if (typeof createImageBitmap === 'function') {
        source = await createImageBitmap(blob);
        width = source.width;
        height = source.height;
      } else if (hasDocument) {
        source = await loadImageFromBlob(blob);
        width = source.width;
        height = source.height;
      }
    }
  } catch {
    return null;
  }

  if (!source) return null;
  const targetPixels = Math.round(targetDpi * 8.27);
  if (!rawParameters && (Math.max(width, height) <= targetPixels * 1.05 || targetPixels <= 0)) {
    if (isImageBitmapInstance(source)) source.close();
    return null;
  }

  const scale = targetPixels <= 0 ? 1 : Math.min(1, targetPixels / Math.max(width, height));
  const targetWidth = Math.max(1, Math.round(width * scale));
  const targetHeight = Math.max(1, Math.round(height * scale));
  let resultBlob: Blob | null = null;

  if (hasOffscreenCanvas) {
    const canvas = new OffscreenCanvas(targetWidth, targetHeight);
    const context = canvas.getContext('2d');
    if (!context) return null;
    context.imageSmoothingEnabled = true;
    context.imageSmoothingQuality = 'high';
    if (isImageDataInstance(source)) {
      if (width === targetWidth && height === targetHeight) {
        context.putImageData(source, 0, 0);
      } else {
        const temporary = new OffscreenCanvas(width, height);
        temporary.getContext('2d')?.putImageData(source, 0, 0);
        context.drawImage(temporary, 0, 0, targetWidth, targetHeight);
      }
    } else {
      context.drawImage(source, 0, 0, targetWidth, targetHeight);
    }
    resultBlob = await canvas.convertToBlob({ type: 'image/jpeg', quality });
  } else if (hasDocument) {
    const canvas = document.createElement('canvas');
    canvas.width = targetWidth;
    canvas.height = targetHeight;
    const context = canvas.getContext('2d');
    if (!context) return null;
    context.imageSmoothingEnabled = true;
    context.imageSmoothingQuality = 'high';
    if (isImageDataInstance(source)) {
      const temporary = document.createElement('canvas');
      temporary.width = width;
      temporary.height = height;
      temporary.getContext('2d')?.putImageData(source, 0, 0);
      context.drawImage(temporary, 0, 0, targetWidth, targetHeight);
    } else {
      context.drawImage(source, 0, 0, targetWidth, targetHeight);
    }
    resultBlob = await new Promise(resolve => canvas.toBlob(resolve, 'image/jpeg', quality));
  }

  if (isImageBitmapInstance(source)) source.close();
  if (!resultBlob) return null;
  return {
    bytes: new Uint8Array(await resultBlob.arrayBuffer()),
    width: targetWidth,
    height: targetHeight,
  };
}

function hashBytes(bytes: Uint8Array): string {
  let hash = 0;
  for (let index = 0; index < bytes.length; index += 1) {
    hash = (hash << 5) - hash + bytes[index];
    hash |= 0;
  }
  return hash.toString(36);
}

async function downscaleDocumentImages(
  pdfDoc: PDFDocument,
  targetDpi: number,
  quality: number,
): Promise<number> {
  let universalOptimizedCount = 0;
  const processedImages = new Map<string, DownscaledImage>();

  for (const [reference, object] of pdfDoc.context.enumerateIndirectObjects()) {
    if (!(object instanceof PDFRawStream)) continue;
    if (object.dict.get(PDFName.of('Subtype')) !== PDFName.of('Image')) continue;

    const filter = object.dict.get(PDFName.of('Filter'));
    const isDct = filter === PDFName.of('DCTDecode') ||
      (filter instanceof PDFArray && filter.asArray().some(value => value === PDFName.of('DCTDecode')));
    const isFlate = filter === PDFName.of('FlateDecode') ||
      (filter instanceof PDFArray && filter.asArray().some(value => value === PDFName.of('FlateDecode')));
    if (!isDct && !isFlate) continue;

    let imageBytes = object.contents;
    let rawParameters: RawImageParameters | undefined;
    if (isFlate) {
      const decompressed = await decompressFlateStream(imageBytes);
      if (!decompressed) continue;
      const widthObject = object.dict.get(PDFName.of('Width'));
      const heightObject = object.dict.get(PDFName.of('Height'));
      const colorSpaceObject = object.dict.get(PDFName.of('ColorSpace'));
      const bitsObject = object.dict.get(PDFName.of('BitsPerComponent'));
      const parameters = object.dict.get(PDFName.of('DecodeParms'));

      if (!(widthObject instanceof PDFNumber) ||
          !(heightObject instanceof PDFNumber) ||
          !(bitsObject instanceof PDFNumber) ||
          bitsObject.asNumber() !== 8) {
        continue;
      }
      const width = widthObject.asNumber();
      const height = heightObject.asNumber();
      const colorSpace = colorSpaceObject instanceof PDFName
        ? colorSpaceObject.asString().replace(/^\//, '')
        : 'DeviceRGB';
      const bytesPerPixel = colorSpace === 'DeviceRGB' ? 3 : 1;
      let predictor = 1;
      if (parameters instanceof PDFDict) {
        const predictorObject = parameters.get(PDFName.of('Predictor'));
        if (predictorObject instanceof PDFNumber) predictor = predictorObject.asNumber();
      }
      if (predictor >= 10) {
        imageBytes = unfilterPng(decompressed, width, height, bytesPerPixel);
      } else if (predictor > 1) {
        continue;
      } else {
        imageBytes = decompressed;
      }
      rawParameters = { width, height, colorSpace };
    }

    const hash = hashBytes(imageBytes);
    const result = processedImages.get(hash) ??
      await downscaleImage(imageBytes, targetDpi, quality, rawParameters);
    if (!result) continue;

    const newStream = PDFRawStream.of(object.dict, result.bytes);
    newStream.dict.set(PDFName.of('Length'), pdfDoc.context.obj(result.bytes.length));
    newStream.dict.set(PDFName.of('Filter'), PDFName.of('DCTDecode'));
    newStream.dict.set(PDFName.of('Width'), pdfDoc.context.obj(result.width));
    newStream.dict.set(PDFName.of('Height'), pdfDoc.context.obj(result.height));
    newStream.dict.delete(PDFName.of('DecodeParms'));
    pdfDoc.context.assign(reference, newStream);
    processedImages.set(hash, result);
    if (!isDct) universalOptimizedCount += 1;
  }

  return universalOptimizedCount;
}
