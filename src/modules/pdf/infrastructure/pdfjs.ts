import type { BinaryInput, NamedBinarySource, PageDimensions } from '../core/contracts';
import { PdfModuleError } from '../core/errors';
import { isNamedBinarySource, readBytes } from '../core/input';

export type PdfjsViewport = { width: number; height: number };

export interface PdfjsPage {
  getViewport(params: { scale: number }): PdfjsViewport;
  render(params: {
    canvasContext: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D;
    viewport: PdfjsViewport;
    canvasFactory?: typeof pdfjsCanvasFactory;
  }): { promise: Promise<void> };
  cleanup(): void;
}

export interface PdfjsDocument {
  numPages: number;
  getPage(pageNumber: number): Promise<PdfjsPage>;
}

type PdfJsModule = typeof import('pdfjs-dist/legacy/build/pdf');
let pdfjsModulePromise: Promise<PdfJsModule> | null = null;
const documentCache = new WeakMap<NamedBinarySource, Promise<PdfjsDocument>>();

function getRuntimeOrigin(): string {
  if (typeof globalThis.location !== 'undefined' && globalThis.location.origin) {
    return globalThis.location.origin;
  }
  throw new PdfModuleError('UNSUPPORTED_CAPABILITY', 'PDF.js requires a browser or worker location');
}

export function getPdfJsWorkerSrc(version: string): string {
  return `/pdf.worker.min.js?v=${encodeURIComponent(version)}`;
}

async function getPdfJsModule(): Promise<PdfJsModule> {
  if (!pdfjsModulePromise) {
    pdfjsModulePromise = import('pdfjs-dist/legacy/build/pdf').then(module => {
      if (!module.GlobalWorkerOptions.workerSrc) {
        // Versioned so a cached worker from an older PDF.js release is never paired with
        // a newer API (PDF.js refuses mismatched versions and every render fails).
        module.GlobalWorkerOptions.workerSrc = getPdfJsWorkerSrc(module.version);
      }
      return module;
    });
  }
  return pdfjsModulePromise;
}

export async function loadPdfJsDocument(input: BinaryInput): Promise<PdfjsDocument> {
  const source = isNamedBinarySource(input) ? input : null;
  const cached = source ? documentCache.get(source) : undefined;
  if (cached) return cached;

  const promise = (async () => {
    const pdfjs = await getPdfJsModule();
    const data = await readBytes(input);
    const origin = getRuntimeOrigin();
    const isApplicationWorker = 'importScripts' in globalThis;
    const loadingTask = pdfjs.getDocument({
      data,
      cMapUrl: `${origin}/cmaps/`,
      cMapPacked: true,
      standardFontDataUrl: `${origin}/standard_fonts/`,
      wasmUrl: `${origin}/wasm/`,
      disableFontFace: isApplicationWorker,
      useWorkerFetch: !isApplicationWorker,
    });
    return loadingTask.promise as unknown as PdfjsDocument;
  })();

  if (source) documentCache.set(source, promise);
  return promise;
}

type CanvasAndContext = {
  canvas: HTMLCanvasElement | OffscreenCanvas | null;
  context: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D | null;
};

export function createPdfCanvas(width: number, height: number): Exclude<CanvasAndContext, { canvas: null }> {
  if (width <= 0 || height <= 0) throw new Error('Invalid canvas size');
  let canvas: HTMLCanvasElement | OffscreenCanvas;
  if (typeof OffscreenCanvas !== 'undefined') {
    canvas = new OffscreenCanvas(width, height);
  } else if (typeof document !== 'undefined') {
    canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
  } else {
    throw new PdfModuleError('UNSUPPORTED_CAPABILITY', 'Canvas support required for PDF rendering');
  }
  const context = canvas.getContext('2d') as
    | CanvasRenderingContext2D
    | OffscreenCanvasRenderingContext2D
    | null;
  if (!context) {
    throw new PdfModuleError('UNSUPPORTED_CAPABILITY', '2D canvas context is unavailable');
  }
  return { canvas, context };
}

export const pdfjsCanvasFactory = {
  create(width: number, height: number): CanvasAndContext {
    return createPdfCanvas(width, height);
  },
  reset(target: CanvasAndContext, width: number, height: number): void {
    if (!target.canvas) throw new Error('Canvas has been destroyed');
    target.canvas.width = width;
    target.canvas.height = height;
  },
  destroy(target: CanvasAndContext): void {
    target.canvas = null;
    target.context = null;
  },
};

export async function getPdfJsPageCount(input: BinaryInput): Promise<number> {
  return (await loadPdfJsDocument(input)).numPages;
}

export async function getPdfJsPageDimensions(
  input: BinaryInput,
  pageNumber: number,
): Promise<PageDimensions> {
  const pdf = await loadPdfJsDocument(input);
  const resolvedPage = Math.min(Math.max(pageNumber, 1), pdf.numPages);
  return (await pdf.getPage(resolvedPage)).getViewport({ scale: 1 });
}
