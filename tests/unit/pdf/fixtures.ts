import { PDFDocument, degrees } from 'pdf-lib';
import type { NamedBinarySource } from '../../../src/modules/pdf/core/contracts';

export async function createPdfBytes(
  widths: number[],
  options: { title?: string; rotation?: number } = {},
): Promise<Uint8Array> {
  const pdf = await PDFDocument.create();
  widths.forEach((width, index) => {
    const page = pdf.addPage([width, 200 + index]);
    page.drawText(`Page ${index + 1}`);
    if (options.rotation !== undefined) page.setRotation(degrees(options.rotation));
  });
  if (options.title) pdf.setTitle(options.title);
  return pdf.save();
}

export function namedSource(
  name: string,
  type: string,
  bytes: Uint8Array,
): NamedBinarySource {
  return {
    name,
    type,
    size: bytes.byteLength,
    async arrayBuffer() {
      const copy = new Uint8Array(bytes);
      return copy.buffer;
    },
  };
}

export const ONE_PIXEL_PNG = Uint8Array.from(
  Buffer.from(
    'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAusB9Y9Z5ZsAAAAASUVORK5CYII=',
    'base64',
  ),
);
