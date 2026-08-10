type WorkerDocumentShim = {
  createElement(tagName: string): OffscreenCanvas | {
    getContext(): null;
    style: Record<string, never>;
  };
  head: { appendChild(): void };
  body: { appendChild(): void };
  baseURI: string;
};

type PdfWorkerGlobal = {
  window?: unknown;
  document?: WorkerDocumentShim;
};

/** Install only the browser globals required by the PDF.js legacy build. */
export function installPdfWorkerEnvironment(): void {
  const scope = globalThis as unknown as PdfWorkerGlobal;
  if (!scope.window) scope.window = globalThis;
  if (scope.document) return;

  scope.document = {
    createElement(tagName: string) {
      if (tagName === 'canvas') {
        if (typeof OffscreenCanvas !== 'undefined') return new OffscreenCanvas(1, 1);
        throw new Error('OffscreenCanvas not supported in this worker');
      }
      return { getContext: () => null, style: {} };
    },
    head: { appendChild() {} },
    body: { appendChild() {} },
    baseURI: globalThis.location.href,
  };
}
