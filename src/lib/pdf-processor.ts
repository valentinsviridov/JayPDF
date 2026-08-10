/**
 * Compatibility facade for the existing interface. New presentation code
 * should consume PdfProcessorService/PdfDocumentService through injection.
 */
import {
  browserPdfDocumentService,
  type PdfDocumentService,
} from '../modules/pdf/document-service';
import type {
  PdfOperationKey,
  ProcessorOptions,
} from '../modules/pdf/operation-map';
import type { CompressionResult } from '../modules/pdf/operations/compress/definition';
import type { PdfToImagesResult } from '../modules/pdf/operations/pdf-to-images/definition';
import {
  browserPdfProcessorService,
  createPdfBlob,
  type PdfProcessorService,
} from '../modules/pdf/processor-service';
import { pdfWorkerClient } from '../modules/pdf/worker-client';

export type PDFProcessingMode = PdfOperationKey;
export type PDFProcessingOptions = ProcessorOptions;
export type ProcessingResult = CompressionResult;
export type PdfToImagesArchiveResult = PdfToImagesResult;
export { createPdfBlob };
export type { PdfDocumentService, PdfProcessorService };

export function processPDF(
  mode: 'compress',
  files: [File, ...File[]],
  options: PDFProcessingOptions,
): Promise<ProcessingResult>;
export function processPDF(
  mode: 'merge',
  files: [File, ...File[]],
  options: PDFProcessingOptions,
): Promise<Blob>;
export function processPDF(
  mode: 'split',
  files: [File, ...File[]],
  options: PDFProcessingOptions,
): Promise<Blob[]>;
export function processPDF(
  mode: 'extract' | 'crop' | 'rotate' | 'reorder' | 'imagesToPdf',
  files: [File, ...File[]],
  options: PDFProcessingOptions,
): Promise<Blob>;
export function processPDF(
  mode: 'pdfToImages',
  files: [File, ...File[]],
  options: PDFProcessingOptions,
): Promise<PdfToImagesArchiveResult>;
export function processPDF(
  mode: PdfOperationKey,
  files: [File, ...File[]],
  options: PDFProcessingOptions,
): Promise<ProcessingResult | Blob | Blob[] | PdfToImagesArchiveResult> {
  return browserPdfProcessorService.execute(mode, files, options);
}

export function compressPDFFile(
  file: File,
  options: PDFProcessingOptions = {} as PDFProcessingOptions,
): Promise<ProcessingResult> {
  return browserPdfProcessorService.execute('compress', [file], options);
}

export function mergePDFsAsBlob(files: File[], options: PDFProcessingOptions): Promise<Blob> {
  return browserPdfProcessorService.execute('merge', files, options);
}

export function splitPDFAsBlobs(file: File, options: PDFProcessingOptions): Promise<Blob[]> {
  return browserPdfProcessorService.execute('split', [file], options);
}

export function extractPagesAsBlob(
  file: File,
  pageNumbers: number[],
  options: PDFProcessingOptions,
): Promise<Blob> {
  return browserPdfProcessorService.execute('extract', [file], {
    ...options,
    pagesToExtract: pageNumbers,
  });
}

export function cropPagesAsBlob(
  file: File,
  pageNumbers: number[],
  options: PDFProcessingOptions,
): Promise<Blob> {
  return browserPdfProcessorService.execute('crop', [file], {
    ...options,
    pagesToCrop: pageNumbers,
  });
}

export function rotatePagesAsBlob(
  file: File,
  pageNumbers: number[],
  options: PDFProcessingOptions,
): Promise<Blob> {
  return browserPdfProcessorService.execute('rotate', [file], {
    ...options,
    pagesToRotate: pageNumbers,
  });
}

export async function getPdfPageCount(file: File): Promise<number> {
  try {
    return await pdfWorkerClient.getPageCount(file);
  } catch {
    return browserPdfDocumentService.getPageCount(file);
  }
}

export function getPdfPageDimensions(file: File, pageNumber: number) {
  return browserPdfDocumentService.getPageDimensions(file, pageNumber);
}

export function renderPdfThumbnail(file: File, pageNumber: number, targetWidth?: number) {
  return browserPdfDocumentService.renderThumbnail(file, pageNumber, targetWidth);
}
