import { PDFDocument } from 'pdf-lib';
import type { LoadOptions } from 'pdf-lib';
import type { BinaryInput, PdfMetadata } from './contracts';
import { PdfModuleError } from './errors';
import { readBytes } from './input';

/**
 * Behavior-compatible loader for the initial split. Encryption policy is
 * centralized here so it can be hardened independently with dedicated tests.
 */
export async function loadPdfWithBasicValidation(
  input: BinaryInput,
  options: LoadOptions = {},
): Promise<PDFDocument> {
  const bytes = await readBytes(input);
  const pdfDoc = await PDFDocument.load(bytes, options);

  try {
    if (pdfDoc.getPages().length === 0) {
      throw new Error('PDF has no pages');
    }
  } catch (cause) {
    throw new PdfModuleError(
      'CORRUPT_PDF',
      'This PDF document is corrupted or malformed and cannot be safely processed. Please repair the file before using it.',
      { cause },
    );
  }

  return pdfDoc;
}

export function applyMetadata(pdfDoc: PDFDocument, metadata?: PdfMetadata): void {
  if (!metadata) return;
  if (metadata.title) pdfDoc.setTitle(metadata.title);
  if (metadata.author) pdfDoc.setAuthor(metadata.author);
  if (metadata.subject) pdfDoc.setSubject(metadata.subject);
  if (metadata.keywords) pdfDoc.setKeywords([metadata.keywords]);
}

export function copyBasicMetadata(source: PDFDocument, target: PDFDocument): void {
  const title = source.getTitle();
  const author = source.getAuthor();
  const subject = source.getSubject();
  if (title) target.setTitle(title);
  if (author) target.setAuthor(author);
  if (subject) target.setSubject(subject);
}
