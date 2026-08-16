import { PDFDocument } from 'pdf-lib';
import type { LoadOptions } from 'pdf-lib';
import type { BinaryInput, PdfMetadata } from './contracts';
import { PdfModuleError } from './errors';
import { isNamedBinarySource, readBytes } from './input';

import { repairPdf } from '../operations/repair';

export type LoadValidationOptions = {
  autoRepairCorrupted?: boolean;
};

/**
 * Behavior-compatible loader for the initial split. Encryption policy is
 * centralized here so it can be hardened independently with dedicated tests.
 */
export async function loadPdfWithBasicValidation(
  input: BinaryInput,
  options: LoadOptions = {},
  validationOptions: LoadValidationOptions = {},
): Promise<PDFDocument> {
  const bytes = await readBytes(input);
  const name = isNamedBinarySource(input) ? input.name : undefined;
  const fileDetail = name ? ` (${name})` : '';

  try {
    const pdfDoc = await PDFDocument.load(bytes, options);
    if (pdfDoc.getPages().length === 0) {
      throw new Error('PDF has no pages');
    }
    return pdfDoc;
  } catch (cause) {
    if (cause instanceof PdfModuleError && cause.code !== 'CORRUPT_PDF') {
      throw cause;
    }

    if (validationOptions.autoRepairCorrupted) {
      try {
        const repairedBytes = await repairPdf([input]);
        const repairedDoc = await PDFDocument.load(repairedBytes, options);
        if (repairedDoc.getPages().length > 0) {
          return repairedDoc;
        }
      } catch {
        // If repair fails, fall through to throw CORRUPT_PDF
      }
    }

    throw new PdfModuleError(
      'CORRUPT_PDF',
      `This PDF document${fileDetail} is corrupted or malformed and cannot be safely processed. Please repair the file before using it (printing the file to PDF using a virtual printer could help).`,
      { cause },
    );
  }
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
