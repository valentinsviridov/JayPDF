import type { PageDimensions } from './core/contracts';
import { canvasToBlob, isOffscreenCanvasInstance } from './infrastructure/browser-images';
import {
  createPdfCanvas,
  getPdfJsPageCount,
  getPdfJsPageDimensions,
  loadPdfJsDocument,
  pdfjsCanvasFactory,
} from './infrastructure/pdfjs';
import { PdfWorkerClient, pdfWorkerClient } from './worker-client';

const FALLBACK_THUMBNAIL =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR4nGNgYAAAAAMAASsJTYQAAAAASUVORK5CYII=';
const thumbnailCache = new WeakMap<File, Map<string, string>>();

export interface PdfDocumentService {
  getPageCount(file: File): Promise<number>;
  getPageDimensions(file: File, pageNumber: number): Promise<PageDimensions>;
  renderThumbnail(file: File, pageNumber: number, targetWidth?: number): Promise<string>;
}

function getThumbnailCache(file: File): Map<string, string> {
  const existing = thumbnailCache.get(file);
  if (existing) return existing;
  const created = new Map<string, string>();
  thumbnailCache.set(file, created);
  return created;
}

async function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error ?? new Error('Could not read thumbnail'));
    reader.readAsDataURL(blob);
  });
}

export const browserPdfDocumentService: PdfDocumentService = {
  async getPageCount(file) {
    try {
      return await getPdfJsPageCount(file);
    } catch (error) {
      console.error('Error getting page count via pdfjs-dist:', error);
      return 0;
    }
  },

  async getPageDimensions(file, pageNumber) {
    try {
      return await getPdfJsPageDimensions(file, pageNumber);
    } catch (error) {
      console.error('Error getting page dimensions via pdfjs-dist:', error);
      return { width: 0, height: 0 };
    }
  },

  async renderThumbnail(file, pageNumber, targetWidth = 160) {
    const width = Math.max(1, Math.round(targetWidth));
    const cache = getThumbnailCache(file);
    const cacheKey = `${pageNumber}_${width}`;
    const cached = cache.get(cacheKey);
    if (cached) return cached;

    try {
      const pdf = await loadPdfJsDocument(file);
      const page = await pdf.getPage(pageNumber);
      const baseViewport = page.getViewport({ scale: 1 });
      const viewport = page.getViewport({ scale: width / baseViewport.width });
      const { canvas, context } = createPdfCanvas(viewport.width, viewport.height);
      context.fillStyle = '#ffffff';
      context.fillRect(0, 0, canvas.width, canvas.height);
      await page.render({ canvasContext: context, viewport, canvasFactory: pdfjsCanvasFactory }).promise;

      const url = isOffscreenCanvasInstance(canvas)
        ? await blobToDataUrl(await canvasToBlob(canvas, 'image/png'))
        : canvas.toDataURL('image/png');
      cache.set(cacheKey, url);
      page.cleanup();
      return url;
    } catch {
      return FALLBACK_THUMBNAIL;
    }
  },
};

export function createWorkerBackedPdfDocumentService(
  workerClient: PdfWorkerClient = pdfWorkerClient,
  fallback: PdfDocumentService = browserPdfDocumentService,
): PdfDocumentService {
  return {
    async getPageCount(file) {
      try {
        return await workerClient.getPageCount(file);
      } catch {
        return fallback.getPageCount(file);
      }
    },
    getPageDimensions: (file, pageNumber) => fallback.getPageDimensions(file, pageNumber),
    renderThumbnail: (file, pageNumber, targetWidth) =>
      fallback.renderThumbnail(file, pageNumber, targetWidth),
  };
}

export const workerBackedPdfDocumentService = createWorkerBackedPdfDocumentService();
