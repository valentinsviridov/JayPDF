# PDFLince monolith split: architectural analysis and refactoring design

Status: analysis complete; modular split implemented
Prepared: 2026-08-10
Scope: client-side PDF processing engine, browser worker boundary, React integration, and automated-test architecture

## 1. Executive summary

PDFLince is not a server monolith. It is a static Next.js application whose browser-side implementation has accumulated two tightly connected code monoliths:

1. `src/components/pdf-processor/index.tsx` is a 2,497-line React component that owns feature selection, uploaded files, per-file page selections, per-file page order, every operation's defaults, validation, compression preview caching, execution, download side effects, analytics, translated status messages, and most feature-specific rendering.
2. `src/lib/pdf-operations.ts` is a 1,226-line engine file that combines nine user-facing operations, PDF parsing and rendering, `pdf-lib` mutation, `pdfjs-dist` rendering, image/canvas conversion, ZIP creation, caches, metadata handling, browser feature detection, and low-level PDF stream rewriting.

The worker and main-thread fallback both import the whole engine file. The UI imports a facade, but the facade is a dispatcher rather than a genuine abstraction: its public model is the same global options bag used by the implementation, and the UI's behavior is coupled to concrete result types and browser download mechanics.

The recommended split is a modular monolith with explicit layers:

```text
React presentation
      |
      v
UI-facing service ports (injected and mockable)
      |
      v
typed application executor
      |
      +--------------------+
      |                    |
      v                    v
worker transport      local fallback
      |                    |
      +----------+---------+
                 v
       lazy operation registry
                 |
       +---------+---------+--- ...
       v         v         v
     merge     split    compress       independently testable feature modules
                 |
                 v
        small shared PDF primitives
```

The important boundary is not merely a new directory structure. Each operation must own its option type, defaults, validation, execution, and result contract. React must depend on a `PdfProcessorService` and `PdfDocumentService`, not on `pdf-lib`, `pdfjs-dist`, a worker, or concrete singleton functions. The worker protocol must use the same operation map as local execution. Shared code must contain mechanisms only; feature policy belongs to its feature.

This produces the following extension path for a future feature:

1. Add one feature folder with its contract and executor.
2. Add one lazy registry entry.
3. Add a lightweight UI definition and, if required, a presentation panel.
4. Add unit contract tests directly against bytes, without React, downloads, a browser, or the worker.
5. Add only a thin browser integration test for the route and worker path.

It also makes the upcoming UI redesign safe: the current UI can be replaced while the operation modules, typed executor, document-preview service, and tests remain unchanged.

## 2. Goals and non-goals

### 2.1 Goals

- Give every user-facing operation an independent module boundary.
- Remove all direct PDF-library and worker knowledge from presentation components.
- Make operation behavior directly testable with `Uint8Array` inputs and results.
- Preserve the privacy-first rule: files remain in the browser and no processing API is introduced.
- Preserve static export and Web Worker execution.
- Keep main-thread fallback available where browser capabilities require it.
- Replace stringly typed dispatch with a compile-time operation/result map.
- Keep feature defaults and accepted-file policy outside the React shell.
- Make worker lifecycle and failures deterministic and testable.
- Keep current UI behavior and localized copy while allowing the UI to be discarded later.
- Add fast unit/contract tests before relying on slower Playwright tests.
- Document risky dependencies on `pdf-lib` internals so future upgrades are deliberate.

### 2.2 Non-goals

- No server-side PDF processing or file upload API.
- No state-management dependency such as Redux or Zustand solely for this refactor.
- No visual redesign in this change.
- No broad rewrite of locale dictionaries or routes.
- No promise of lossless preservation of every PDF catalog feature; `pdf-lib` itself and the current copy strategy impose limits described below.
- No attempt to turn compression into a standards-complete PDF optimizer.
- No dependency upgrade bundled into the structural refactor.

## 3. Current repository and runtime topology

### 3.1 Build and deployment

- Next.js `16.2.12`, React `19.2.8`, and TypeScript `5.9.3` are locked by `bun.lock`.
- `next.config.ts` sets `output: "export"`; 112 localized/static pages are emitted.
- The output is served by nginx in the release Docker stage.
- There are no processing routes, server actions, or middleware. PDF bytes stay client-side.
- Bun is the mandated package manager and script runner.
- The production build succeeds when Turbopack is allowed to bind its internal localhost port. In the restricted development sandbox it fails while PostCSS is being evaluated because process/port creation is denied; this is environmental, not a source failure.

### 3.2 Relevant source inventory before refactoring

| Area | File(s) | Approximate size | Responsibility today |
| --- | --- | ---: | --- |
| React orchestrator | `src/components/pdf-processor/index.tsx` | 2,497 lines | All modes, state, validation, workflows, downloads, status, rendering |
| PDF engine | `src/lib/pdf-operations.ts` | 1,226 lines | Nine operations, PDF.js, canvas, compression internals, ZIP |
| Browser facade | `src/lib/pdf-processor.ts` | 274 lines | Worker-first dispatch, fallbacks, Blob conversion |
| Worker client | `src/lib/worker-client.ts` | 62 lines | Singleton worker and pending-promise map |
| Worker entry | `src/workers/pdf.worker.ts` | 132 lines | Environment polyfill, second dispatch switch, transfer lists |
| Processor children | `src/components/pdf-processor/*.tsx` | about 3,220 additional lines | Upload, lists, page selection/order, crop, option forms, dialogs |
| Tests | `tests/e2e/*.spec.ts` | 1,351 lines | Browser-only happy paths and selected corruption/worker cases |

### 3.3 Current request flow

```text
localized operation route
  -> OperationPageContent
    -> <PDFProcessor initialMode=...>
      -> local React state and feature-specific validation
      -> processPDF(mode, files, globalOptionsBag)
        -> pdfWorkerClient.run(mode, files, options)
          -> src/workers/pdf.worker.ts switch(mode)
            -> function in the monolithic pdf-operations.ts
        -> on any rejected worker call, call the same monolithic function on main thread
      -> turn bytes into Blob where needed
      -> create <a>, click it, and revoke object URL
      -> translate and display status
```

PDF thumbnails take a different path:

```text
PageSelector / PageOrderer / FileList / Crop / CompressionDiff
  -> direct facade function import
  -> pdfjs-dist on the main thread
  -> canvas or OffscreenCanvas
  -> data URL
```

This means the facade does not fully decouple UI and implementation: multiple child components know exactly which PDF utility functions exist and import a global implementation singleton.

## 4. Current feature behavior and dependencies

### 4.1 Compress

Inputs:

- Exactly one PDF per engine call; the UI loops over multiple files.
- Options used: `compressionLevel`, `preserveMetadata`, `stripAnnotations`, `downscaleImages`, `downscaleImagesDpi`, and `imageQuality`.

Output:

- `ProcessingResult` containing bytes, original/processed sizes, ratio, elapsed time, and a count of converted non-JPEG image streams.

Implementation:

- Loads with `PDFDocument.load`.
- Optionally deletes Info/catalog metadata through low-level context objects.
- Optionally deletes page annotation arrays by enumerating all indirect dictionaries.
- Optionally rewrites DCT/JPEG and Flate image streams using canvas JPEG conversion.
- Saves the entire PDF again.

Important semantic detail: `compressionLevel` itself does not select a compression algorithm or quality. Inside the engine it only changes `objectsPerTick` from 50 to 500. In `pdf-lib`, `objectsPerTick` controls how often serialization yields; it is a responsiveness knob, not a compression-ratio knob. The UI presets create the visible low/medium/high behavior by also changing metadata removal, annotation stripping, image downscaling, and DPI. Keeping presets only in React therefore makes the feature's actual behavior impossible to understand or test from the engine contract alone.

Image optimization limitations:

- Only DCTDecode and FlateDecode image streams are considered.
- Flate images require 8-bit RGB or gray samples.
- PNG predictors 10-15 are decoded; unsupported predictors are skipped.
- CMYK, Indexed color, JPX, JBIG2, CCITT, masks, and several filter chains are not comprehensively handled.
- Target size is based on `targetDpi * 8.27`, an A4-width heuristic, not the image's effective size on each page. “DPI” is therefore approximate.
- A small 32-bit rolling hash deduplicates converted bytes. A collision, although uncommon, could replace a distinct image with the wrong cached result.
- Replacing a stream while retaining most of the old dictionary risks incompatibilities with soft masks, decode arrays, or color-space expectations.
- Metadata and annotation removal use `pdf-lib` core classes and document context, which are not stable public application APIs.

### 4.2 Merge

Inputs:

- Two or more PDFs are required by the UI, although the engine returns the input bytes unchanged for one file.
- Options used: `addPageDividers` and selected document metadata.

Output: one `Uint8Array`, adapted to a PDF Blob by the browser facade.

Implementation:

- Creates a new `PDFDocument`.
- Loads each source and calls `copyPages` with all page indices.
- Adds a blank white divider between sources when requested.
- Sets selected metadata fields.
- Saves with object streams disabled.

Consequences:

- The result is a newly constructed document. Document-level outlines/bookmarks, attachments, named destinations, JavaScript, viewer preferences, AcroForm relationships, and other catalog objects are not intentionally merged.
- The declared `bookmarkHandling` option is unused.
- A metadata title setter is duplicated in the current code.
- Page copying can bring more resources than a page visibly uses; this can affect result size.

### 4.3 Split

Inputs: one PDF and `pagesPerFile` (default 1).

Output: an array of PDF byte arrays.

The UI can process several source PDFs, but the engine processes one at a time. Each part is a new document built with `copyPages`. The options `splitMode`, `splitPoints`, and `outputNamePattern` exist in the global model but are unused. The current code does not validate an upper bound or integer-ness at the engine boundary; UI number handling does most of that policy.

### 4.4 Extract

Inputs: one PDF, a one-based page-number list, and `preserveMetadata`.

Output: one new PDF.

Page numbers are converted to zero-based indices, invalid indices are dropped, and remaining indices are sorted. As a result, caller order is deliberately not retained. Duplicate page numbers are not removed. Only title, author, and subject are copied when metadata preservation is enabled.

### 4.5 Reorder

Inputs: one PDF, a one-based page order, and `preserveMetadata`.

Output: one new PDF.

Unlike extract, the order is retained, making repeated page numbers an implicit duplication mechanism. Invalid page numbers are silently removed. A completely invalid order fails. The UI lazily constructs identity order by asking PDF.js for page count.

### 4.6 Crop

Inputs: one PDF, selected one-based pages, visual margins in PDF points, and metadata options.

Output: a rewritten PDF.

The implementation adjusts margins based on normalized existing page rotation, validates that resulting dimensions are positive, and sets MediaBox, CropBox, BleedBox, TrimBox, and ArtBox to the same rectangle. Content streams are not rewritten; crop is non-destructive clipping. Setting MediaBox as well as CropBox changes the physical page boundary and can affect downstream printing/layout behavior. The detailed bounds error currently exposes useful diagnostic values and should be retained.

### 4.7 Rotate

Inputs: one PDF, selected pages, and a signed quarter-turn (`90`, `180`, `270`, `-90`, `-180`, or `-270`).

Output: a rewritten PDF.

Existing page rotation is added and normalized to 0/90/180/270. The `rotate` key is duplicated both in the public operation union and the worker switch, evidence that the dispatch contract is copied rather than shared.

### 4.8 PDF to images

Inputs: one PDF and PNG/JPEG output, quality, render DPI, base name, and ZIP preference.

Output: either a ZIP Blob or named image Blobs.

This feature uses `pdfjs-dist`, not `pdf-lib`, to render each page to a canvas. It then optionally loads `jszip` dynamically. It is the clearest demonstration that “PDF engine” is not one dependency: mutation and rendering are separate capabilities and need separate adapters.

### 4.9 Images to PDF

Inputs: ordered image files and fit/page/background options.

Output: PDF bytes.

PNG and JPEG are passed directly to `pdf-lib`. WebP/TIFF and other browser-decodable formats are normalized to PNG through `createImageBitmap` or an HTML image/canvas fallback. Each image becomes one page. `contain` and `cover` differ only by scale; the page clips cover overflow naturally.

The UI accepts extensions that the browser may not actually decode in every environment. Acceptance and execution capability are therefore different concepts and errors must remain explicit.

## 5. Dependency analysis

### 5.1 `pdf-lib` 1.17.1

The lockfile resolves `pdf-lib@1.17.1`. Its last listed release is 1.17.1, and the installed package contains CommonJS, ES module, UMD, and minified bundles. Official references:

- Project and limitations: <https://github.com/Hopding/pdf-lib>
- API documentation: <https://pdf-lib.js.org/docs/api/classes/pdfdocument>
- Load options: <https://pdf-lib.js.org/docs/api/interfaces/loadoptions>
- Save options: <https://pdf-lib.js.org/docs/api/interfaces/saveoptions>
- Releases: <https://github.com/Hopding/pdf-lib/releases>

Public APIs used by PDFLince:

- `PDFDocument.create/load/save`
- `getPages`, `getPage`, `getPageCount`, and page indices
- `copyPages`, `addPage`
- page boxes and page rotation
- drawing rectangles/images
- `embedPng` and `embedJpg`
- basic document metadata
- `rgb` and `degrees`

Private/low-level APIs used by compression:

- `PDFDocument.context`
- `context.trailerInfo`
- indirect-object enumeration and assignment
- `PDFDict`, `PDFName`, `PDFRef`, `PDFRawStream`, `PDFArray`, and `PDFNumber`
- direct stream dictionary mutation

Those low-level classes are exported, but they are the library's core object model rather than the high-level document API. They couple compression to the PDF object representation and should be quarantined in the compression module. No other operation should import them.

#### Loading and encryption

Every current mutating operation passes `ignoreEncryption: true`. Official `pdf-lib` documentation is unusually direct: this flag does not decrypt a PDF, modifications can fail or be unexpected, and applications should not use it except for backward compatibility. The current `password` field is unused. The modular loader should centralize this policy so a later hardening change is made once and contract-tested. During a behavior-preserving structural migration, this can remain compatible; the target policy should reject encryption clearly until a real decryption dependency exists.

`throwOnInvalidObject: false` asks the parser to tolerate malformed objects. PDFLince then validates only that `getPages()` succeeds and produces at least one page. That is useful for partially damaged documents but is not comprehensive corruption validation. The distinction must be reflected in naming: this is “load and basic structural validation,” not proof that a PDF is valid.

`updateMetadata` also deserves care. It controls `pdf-lib`'s metadata update behavior during load; it is not the same as preserving every metadata/catalog structure. Feature contracts should not over-promise.

#### Saving and “compression”

`PDFDocument.save` selects `PDFStreamWriter` when `useObjectStreams` is true and `PDFWriter` otherwise. `objectsPerTick` only controls serializer yielding. The current choices vary by feature:

- compression, crop, rotate, and images-to-PDF generally enable object streams;
- merge, split, extract, and reorder explicitly disable them.

These choices affect compatibility and file size and must remain feature-owned. A shared helper should not silently force one global save policy.

#### Copy semantics

`copyPages` recursively copies the referenced page object graph into a different document context. It does not mean “clone the full source document.” The library's own `PDFDocument.copy()` documentation notes that information such as AcroForms and outlines is not all copied. This directly affects merge/split/extract/reorder. Tests must assert what PDFLince guarantees—page order/count, selected metadata, rotations, and boxes—rather than assuming bitwise or catalog-level preservation.

#### Bundler alias

`next.config.ts` aliases the package name `pdf-lib` to `pdf-lib/dist/pdf-lib.min.js` for both Turbopack and webpack. That target is a roughly 525 KB minified UMD build; the package also ships an ESM minified build. The UMD documentation describes it primarily for direct script-tag/global usage. Aliasing a package import to the UMD artifact can reduce tree-shaking and makes bundler behavior more fragile than importing the package's declared module entry.

This refactor should not combine an alias change with the module split because that would make regressions harder to attribute. The alias is recorded as a follow-up experiment: compare worker/main chunk output and browser tests before choosing the package ESM entry or `dist/pdf-lib.esm.min.js`.

### 5.2 `pdfjs-dist` 6.2.108

PDF.js is responsible for reading page count/dimensions and rasterizing thumbnails/pages. It is not used to mutate PDFs.

Current setup:

- The legacy browser build is dynamically imported.
- `GlobalWorkerOptions.workerSrc` points at `/pdf.worker.min.js`.
- `scripts/setup-pdf-worker.mjs` copies the PDF.js worker, CMaps, and standard fonts into `public`.
- A weak cache stores `PDFDocumentProxy` promises by `File` identity.
- Thumbnail data URLs are weakly cached by `File`, page, and width.
- The application worker supplies a minimal `window`/`document` polyfill and prefers `OffscreenCanvas`.

Risks:

- PDF.js and the application's operation worker are distinct worker layers. The environment polyfill and nested-worker behavior are infrastructure concerns and should not live beside PDF mutation code.
- Cached PDF.js documents are not explicitly destroyed. Weak keys allow eventual reclamation, but retained `File` objects retain documents and thumbnail strings.
- Page-count failures become `0`, and thumbnail failures become a transparent one-pixel image. These are convenient UI fallbacks but erase diagnostic information. The service should expose strict methods internally and let the current UI adapter opt into fallback behavior.
- PDF.js package `6.2.108` declares modern Node engine requirements, although PDFLince consumes its browser build. Unit tests should not accidentally depend on Node-side PDF.js.
- The setup script currently copies CMaps and standard fonts but not every possible PDF.js auxiliary asset. Future PDF.js upgrades need an asset checklist.

### 5.3 `jszip` 3.10.1

JSZip is dynamically loaded only by PDF-to-images when ZIP output is requested. This is already a useful feature boundary and should remain dynamic. ZIP creation accepts Blobs and runs entirely in the browser. Unit tests can request non-ZIP output to test raster workflow separately, while one integration test verifies ZIP packaging.

### 5.4 Browser APIs

Feature/browser dependencies include:

- `Worker`, structured clone, transfer lists, and `crypto.randomUUID`
- `Blob`, `File`, object URLs, and anchor downloads
- `OffscreenCanvas`, `HTMLCanvasElement`, `ImageBitmap`, `ImageData`, and `FileReader`
- `DecompressionStream` and `Response`
- `performance.now` and event-loop yielding

These are capabilities, not universal assumptions. They need to be behind small adapters or capability errors so engine tests can inject alternatives and main-thread fallback can react intentionally.

## 6. Data-model problems

### 6.1 Duplicate and stringly operation identity

`OperationKey`, `PDFProcessingMode`, worker `mode: string`, switch cases, UI mode tabs, defaults, dictionaries, routes, and overloads all repeat the same feature list. `rotate` is duplicated in two places. Adding a feature requires synchronized edits across these copies, and TypeScript cannot prove the worker supports what the UI sends.

### 6.2 Global options bag

`PDFProcessingOptions` contains every option for every feature. At least these fields are currently declared but unused by implementation or UI:

- `outputFormat`
- `pageRange`
- `password`
- `cropInputMode`
- `bookmarkHandling`
- `splitMode`
- `splitPoints`
- `outputNamePattern`
- `maintainOriginalSize`

The bag allows nonsensical calls such as merge with rotation options and hides which feature owns a default. It also makes tests under-specified because any test can pass unrelated fields without a compiler error.

### 6.3 Weak result typing at the worker boundary

`PDFWorkerClient.run` returns `Promise<unknown>`. Every facade method casts the result. The worker request uses `options: unknown`, and the worker entry destructures it without validation. The operation's key, options, result, and transfer-list logic are not linked by a single type map.

### 6.4 `File` as an engine primitive

Most operations only need bytes but are typed around browser `File`. This forces unit tests toward browser emulation. A structural `BinarySource` (`arrayBuffer`, optional name/type/size metadata) plus `Uint8Array | ArrayBuffer` permits both browser files and in-memory test fixtures.

## 7. UI coupling and state analysis

The main component currently owns at least these state families:

- uploaded files and a mirrored ref;
- current mode and processing status;
- active file index;
- active page selection plus per-file selection maps;
- active page order plus per-file order maps;
- per-mode option snapshots;
- compression preview cache and preview status maps;
- compression summary entries;
- processing dialog state;
- mounted and cache refs.

Feature policy embedded in React includes:

- defaults and compression presets;
- accepted file categories/extensions;
- minimum file count;
- which features need page selection or ordering;
- building extract/crop/rotate plans;
- lazy identity order for reorder;
- output naming;
- all per-operation execution loops;
- result aggregation and metrics;
- automatic multi-download timing;
- when previews are reusable;
- which components render for each mode.

Effects synchronize duplicate representations of selections/order and remove stale per-file entries. This works, but duplicated “active” and “stored” state creates a large transition surface. A reducer with explicit events can make these transitions pure and unit-testable. Even if React state remains initially, page-selection utilities and operation plans should be pure functions outside components.

Direct child imports of page inspection/rendering also make components harder to test. `PageSelector`, `PageOrderer`, `FileList`, `UnifiedCropInterface`, and `CompressionDiffSlider` should consume an injected document service through props or a context owned by the composition root.

Downloads are currently operation side effects inside the controller. Processing should return artifacts; a browser download adapter should decide whether/when to trigger downloads. This matters for a redesign, for tests, and for browsers that block multiple synthetic downloads.

Analytics should observe UI/application events and must never be called by engine modules. It remains opt-in and receives no file bytes.

## 8. Worker analysis

Current strengths:

- Heavy mutation is normally off the main thread.
- Result `ArrayBuffer`s are transferred for byte-array results.
- The worker is lazy and reused.
- A main-thread fallback exists.

Current weaknesses:

- Dispatch is duplicated in the facade and worker.
- `mode` is an arbitrary string in the wire message.
- No request validation exists.
- `worker.onerror` only logs; pending promises can remain unsettled forever.
- There is no `messageerror` handling, timeout, cancellation, or progress.
- Every worker-reported feature error triggers a full main-thread retry, even for deterministic invalid input. A corrupt document can therefore be parsed twice.
- Capability failure and domain failure are indistinguishable.
- Termination does not reject pending requests.
- Worker environment polyfills and operation dispatch are mixed in one file.

The target worker client needs a small `WorkerLike` interface and injected factory/ID generator. Infrastructure failures must reject all affected pending requests and reset the worker. Worker-reported domain errors should retain a stable code. Fallback policy should be explicit: retry capability/transport failures, not deterministic validation failures.

## 9. Target architecture

### 9.1 Directory structure

```text
src/modules/pdf/
  core/
    contracts.ts             # BinarySource, metadata, operation-module interface
    errors.ts                # stable error classes/codes
    input.ts                 # structural file detection and byte conversion
    pdf-lib.ts               # load/basic validation and metadata helpers
  infrastructure/
    canvas.ts                # canvas/image capability helpers
    pdfjs.ts                 # PDF.js loading, cache, rendering primitives
  operations/
    compress/
      definition.ts          # option type and defaults, no heavy imports
      image-optimizer.ts      # quarantined pdf-lib core-object manipulation
      index.ts               # operation implementation
    merge/
      definition.ts
      index.ts
    split/
      definition.ts
      index.ts
    extract/
      definition.ts
      index.ts
    crop/
      definition.ts
      index.ts
    rotate/
      definition.ts
      index.ts
    reorder/
      definition.ts
      index.ts
    pdf-to-images/
      definition.ts
      index.ts
    images-to-pdf/
      definition.ts
      index.ts
  catalog.ts                 # lightweight public feature definitions
  operation-map.ts           # key -> options/result type map
  registry.ts                # lazy key -> operation-module loader
  execute.ts                 # typed local execution
  document-service.ts        # page count/dimensions/thumbnail port + browser adapter
  processor-service.ts       # UI-facing worker-first service port + browser adapter
  worker-protocol.ts         # typed request/response/error/transfer helpers

src/components/pdf-processor/
  index.tsx                  # composition root and public component
  services.tsx               # injection context for processor/document/download ports
  controller/                # state transitions and UI-independent planning helpers
  features/                  # current presentation adapters per feature
  shared/                    # upload/list/status components

src/workers/
  pdf.worker.ts              # environment bootstrap + generic protocol handler only

tests/unit/pdf/
  core/
  operations/
  registry.test.ts
  worker-client.test.ts
  fixtures.ts
```

Exact filenames may be consolidated where a feature is small, but dependency direction must remain the same.

### 9.2 Dependency rules

1. `core` imports no React, Next.js, worker singleton, UI strings, analytics, or download APIs.
2. Each operation imports only `core`, required infrastructure, and its own files.
3. Operations never import one another.
4. The registry imports operations lazily; adding a feature does not edit a switch in multiple runtimes.
5. The worker imports the registry/protocol, not individual operations.
6. The React layer imports service interfaces and lightweight definitions, never `pdf-lib` or `pdfjs-dist`.
7. Browser adapters implement ports and are the only owners of workers, object URLs, and canvas/document assumptions.
8. Locale strings remain presentation inputs and never enter engine contracts.

### 9.3 Operation contracts

Conceptual TypeScript shape:

```ts
export interface PdfOperationModule<Options, Result> {
  readonly key: string;
  execute(inputs: readonly BinaryInput[], options: Options): Promise<Result>;
}

export interface PdfOperationMap {
  compress: { options: CompressOptions; result: CompressionResult };
  merge: { options: MergeOptions; result: Uint8Array };
  split: { options: SplitOptions; result: Uint8Array[] };
  extract: { options: ExtractOptions; result: Uint8Array };
  crop: { options: CropOptions; result: Uint8Array };
  rotate: { options: RotateOptions; result: Uint8Array };
  reorder: { options: ReorderOptions; result: Uint8Array };
  pdfToImages: { options: PdfToImagesOptions; result: PdfToImagesResult };
  imagesToPdf: { options: ImagesToPdfOptions; result: Uint8Array };
}
```

The exact operation key determines the permitted options and promised result. A worker request and local call are both derived from this map. There should be no `unknown` cast at every call site; any unavoidable dynamic cast belongs once inside the registry implementation and is covered by registry contract tests.

### 9.4 Lightweight feature definitions

Each feature owns a definition that can be imported by the UI without importing its heavy executor:

- key;
- defaults;
- input kind (`pdf` or `image`);
- multiplicity/minimum count;
- whether order matters;
- whether page selection is required;
- optional preview capability.

This replaces `MODE_DEFAULTS`, `MODE_TABS`, file-type conditionals, and repeated mode groups in the React component. Presentation labels remain in dictionaries and are joined by key.

### 9.5 Service ports

The current UI and future UI should use these capabilities:

```ts
interface PdfProcessorService {
  execute<K extends PublicPdfOperation>(
    key: K,
    files: readonly File[],
    options: PdfOperationMap[K]["options"],
  ): Promise<BrowserResultMap[K]>;
}

interface PdfDocumentService {
  getPageCount(file: File): Promise<number>;
  getPageDimensions(file: File, page: number): Promise<PageDimensions>;
  renderThumbnail(file: File, page: number, width?: number): Promise<string>;
}

interface DownloadService {
  download(artifact: DownloadArtifact): void;
}
```

Tests can supply in-memory fakes. The default browser implementations use the worker, PDF.js, and anchor/object URL APIs. The React context is an injection convenience, not a service locator for engine code.

### 9.6 Error model

Stable categories are preferable to parsing human text:

- `INVALID_INPUT`
- `NO_FILES`
- `NO_PAGES`
- `INVALID_PAGE`
- `ENCRYPTED_PDF`
- `CORRUPT_PDF`
- `UNSUPPORTED_CAPABILITY`
- `WORKER_TRANSPORT`
- `OPERATION_FAILED`

Engine errors contain a code, safe message, optional cause, operation key, and non-sensitive diagnostic details. They never include document bytes. The worker serializes the code/message. Translation remains a UI concern, while existing detailed messages can be used as fallback until dictionary error keys are expanded.

## 10. Per-feature module ownership

| Module | Owns | Shared dependencies | Must not own |
| --- | --- | --- | --- |
| compress | presets/defaults, metadata/annotation/image optimization, compression metrics | PDF loader, canvas capability | dialogs, preview cards, downloads |
| merge | min input count, divider policy, output metadata, copy/save policy | PDF loader, metadata setter | localized filename/status |
| split | chunk size validation, page grouping, copy/save policy | PDF loader | multi-source UI loop/download timing |
| extract | page normalization/sorting, metadata copy | PDF loader, metadata copy helper | selection UI |
| crop | margin validation, rotation mapping, page-box mutation | PDF loader | drag gesture and visual overlay |
| rotate | signed rotation validation/normalization | PDF loader | rotation buttons/thumbnails |
| reorder | order validation and copy semantics | PDF loader, metadata copy helper | drag-and-drop state |
| PDF to images | render options, page rendering, names, ZIP choice | PDF.js, canvas, JSZip | download prompts |
| images to PDF | image normalization, page layout, fit/background | canvas, `pdf-lib` | file list reordering UI |

## 11. Testing architecture

### 11.1 Current gap

The repository currently has Playwright E2E tests only. They provide valuable end-to-end coverage, but every behavior test pays for Next.js startup, browser setup, PDF.js worker setup, selectors, and downloads. Failures often cannot distinguish engine defects from UI timing or browser policy. There are no direct unit tests for page validation, crop rotation mapping, metadata policy, operation typing/registry, worker failure cleanup, or file policy.

### 11.2 Test pyramid after split

#### Level 1: pure unit tests

Run with Bun's built-in test runner; no additional framework is required.

- page-number conversion, deduplication/sorting policy;
- rotation normalization;
- crop margin mapping for 0/90/180/270-degree pages;
- image page layout calculations;
- background color parsing and filename sanitization;
- feature defaults and accepted-file policy;
- reducer/state transition helpers;
- worker response/transfer classification.

#### Level 2: operation contract tests

Create minimal PDFs in memory with `pdf-lib`, execute an operation directly with `Uint8Array`, and load the output for assertions:

- merge preserves source page order and optional divider count;
- split creates expected chunk sizes and rejects invalid chunk sizes;
- extract selects expected pages and obeys ordering policy;
- reorder retains requested order and optional duplication semantics;
- crop produces exact page boxes, including rotated pages;
- rotate composes with existing rotation;
- metadata copy/removal behavior;
- compression result sizes/metrics are internally consistent when image downscaling is disabled;
- images-to-PDF direct PNG/JPEG paths where the test runtime supports required APIs.

These tests are fast, deterministic, and do not touch React or the worker.

#### Level 3: application/worker tests

Use fake `WorkerLike` objects to verify:

- request/result correlation;
- multiple concurrent requests;
- domain-error propagation;
- infrastructure fallback policy;
- rejection and cleanup on `error`, `messageerror`, terminate, or `postMessage` failure;
- no pending request leak.

Registry tests iterate every public operation key, load its module, assert matching keys, and execute standard invalid-input cases. This prevents UI/worker drift when adding a feature.

#### Level 4: component tests or controller tests

Because services are injected, feature panels/controllers can use fake page thumbnails and operation outputs. No real PDF parser is required to test selection, retry, status, or output naming. A browser component test dependency can be added later if desired; the architecture should not require it immediately.

#### Level 5: Playwright E2E

Retain current tests for:

- localized/static route integration;
- file input and current rendering;
- real application worker bundling;
- PDF.js thumbnail rendering;
- canvas-based compression and conversion;
- downloads and ZIP output;
- one happy path per operation;
- corrupt-file user experience.

E2E should not be the only place that page semantics are tested.

### 11.3 Verification command

`scripts/verify-all.sh` should run in this order:

1. frozen/reproducible dependency setup and PDF.js asset setup;
2. lint;
3. TypeScript;
4. fast unit/contract tests;
5. production build;
6. Playwright E2E;
7. Docker image build.

Running unit tests before the expensive build/browser/Docker stages shortens feedback time.

## 12. Migration sequence

### Phase 0: characterize and document

- Record baseline lint, typecheck, build, and E2E behavior.
- Map all option-field consumers and dependency imports.
- Write this document before implementation.

### Phase 1: contracts and shared primitives

- Introduce structural byte inputs, metadata types, stable errors, and operation module interface.
- Centralize basic `pdf-lib` loading and metadata helpers without altering output policy.
- Add direct tests for primitives.

### Phase 2: split engine operations

- Move one operation at a time from `pdf-operations.ts`.
- Preserve each operation's save settings and observable behavior.
- Quarantine compression's core-object code.
- Move PDF.js/canvas logic into infrastructure modules.
- Add contract tests as each feature moves.

### Phase 3: typed registry and worker

- Add lazy operation loaders.
- Replace worker switch with generic execution.
- Replace `unknown` worker calls with operation-map generics.
- Harden worker lifecycle/error cleanup.
- Test the client with a fake worker.

### Phase 4: UI-facing services

- Implement processor/document/download interfaces.
- Adapt worker byte results to browser Blobs in the service, not presentation.
- Inject services into the processor tree.
- Remove direct facade imports from child components.

### Phase 5: React decomposition

- Move defaults/file policy to lightweight feature definitions.
- Move mode-specific option controls and panels into feature presentation folders.
- Move pure selection/order/planning logic out of hooks/components.
- Keep `index.tsx` as a composition root and shell.
- Preserve current markup/selectors to minimize E2E churn before the redesign.

### Phase 6: remove compatibility monoliths

- Delete `pdf-operations.ts` after all imports migrate.
- Reduce `pdf-processor.ts` to a compatibility export or remove it when no internal callers remain.
- Remove duplicate operation unions and dead global option fields.

### Phase 7: full verification

- Run the mandatory verification script.
- Separate source failures from restricted-environment failures such as Turbopack port binding, browser installation, network access, or Docker daemon access.

## 13. Compatibility and risk controls

### 13.1 Behavior-preserving rules for the structural pass

- Keep one-based page-number public contracts.
- Preserve extract sorting and reorder ordering.
- Preserve metadata fields currently copied/set.
- Preserve feature-specific object-stream save choices initially.
- Preserve crop's rotation-aware visual-margin interpretation.
- Preserve current output MIME types and naming in the UI adapter.
- Preserve worker-first execution and main-thread capability fallback.
- Preserve PDF.js public asset URLs and privacy-first local assets.
- Preserve existing DOM labels/selectors wherever practical.

### 13.2 Intentional hardening allowed with explicit tests

- Validate file count and options inside modules, not only UI.
- Reject non-finite/non-integer chunk sizes and page numbers.
- Reject unsupported operation keys at the protocol edge.
- Settle pending worker promises on lifecycle failures.
- Avoid retrying deterministic domain errors on the main thread.
- Remove duplicate `rotate` declarations/cases and duplicate metadata assignment.
- Use structural file detection that does not assume a global `File` constructor.

### 13.3 Deferred dependency behavior changes

- changing `ignoreEncryption` policy;
- changing `pdf-lib` bundler alias;
- changing object-stream save choices;
- supporting full bookmark/form/catalog preservation;
- changing compression heuristics or low-level stream handling;
- adding cancellation/progress UI;
- upgrading PDF.js or `pdf-lib`.

These deserve isolated changes and fixtures because combining them with file moves would obscure regressions.

## 14. Extension recipe after refactoring

For a hypothetical watermark feature:

1. Create `operations/watermark/definition.ts` with `WatermarkOptions`, defaults, and input policy.
2. Create `operations/watermark/index.ts` implementing `PdfOperationModule<WatermarkOptions, Uint8Array>`.
3. Add its type to `PdfOperationMap` and its lazy import to the registry. Compiler errors identify every exhaustive presentation location.
4. Add unit tests that generate an in-memory PDF and inspect page/resources after execution.
5. Add a current-UI options panel registered by key.
6. Add dictionary/route content.
7. Add one Playwright worker/download smoke test.

No existing operation implementation, worker switch, facade overload set, or PDF monolith must be edited.

## 15. Acceptance criteria

The refactor is complete when all of the following are true:

- No file contains implementations for multiple user-facing PDF operations.
- No React component imports `pdf-lib`, `pdfjs-dist`, or a worker client.
- Every operation has a specific option and result type.
- UI, local execution, worker execution, and transfer handling derive from one operation map.
- The worker entry has no per-feature switch.
- Feature defaults and file policy are outside the main React component.
- `src/components/pdf-processor/index.tsx` is a composition boundary rather than the full state machine.
- Child components can receive fake PDF/document services.
- The old `pdf-operations.ts` monolith is removed.
- Direct unit/contract tests cover all PDF mutation operations that do not require a real browser canvas.
- Worker lifecycle behavior has automated tests.
- Existing Playwright behavior remains green.
- `./scripts/verify-all.sh` includes unit tests and passes in an environment with browser/Docker prerequisites.
- No PDF bytes leave the browser and no remote processing/tracking dependency is introduced.

## 16. Architectural decisions

### ADR-1: modular monolith, not packages

Keep modules inside the application repository. Separate npm packages would add build/versioning overhead without providing isolation needed today. Import rules and typed contracts provide the useful boundary.

### ADR-2: ports and dependency injection over global singletons

Default browser services may be singletons for efficiency, but UI code receives an interface through the composition root. This keeps caches/worker reuse while allowing deterministic fakes.

### ADR-3: byte-oriented core

Operation engines accept structural sources or byte arrays. Browser `File` remains an adapter input, not the core model. This is the main enabler for fast tests.

### ADR-4: lazy feature registry

Executors are loaded by operation key. This isolates dependencies and keeps adding a feature from forcing every engine into the initial UI bundle. The lightweight catalog remains synchronous for UI configuration.

### ADR-5: PDF.js is document rendering infrastructure

PDF.js is not hidden inside a generic “PDF operations” file. Page inspection and rasterization are separate services because they have different runtime/canvas/worker needs than `pdf-lib` mutation.

### ADR-6: compression internals are quarantined

Low-level `pdf-lib` object manipulation stays in one compression-owned file with focused tests and upgrade notes. Shared helpers use public APIs wherever possible.

### ADR-7: preserve current UI, design for replacement

The current markup and localized behavior remain during this refactor, but feature policy and execution move out. The upcoming redesign can replace presentation components without reimplementing PDF behavior.

## 17. Follow-up opportunities after the split

These are not prerequisites for the modularization but become substantially easier afterward:

- Add an abort signal and progress events to operation contracts and worker protocol.
- Add per-operation memory estimates/limits for very large PDFs.
- Replace automatic multi-download bursts with an explicit result tray or ZIP packaging.
- Add fixture PDFs for outlines, forms, annotations, encrypted inputs, rotated crops, CMYK images, masks, and unusual filters.
- Evaluate an ESM `pdf-lib` import and compare emitted chunks.
- Add PDF.js document disposal when files leave processor state.
- Replace transparent fallback thumbnails with typed preview states while keeping accessible errors.
- Tighten TypeScript's project-wide `strict` setting incrementally.
- Add lint rules or import-boundary checks preventing UI-to-engine dependency regressions.
- Version operation contracts if plugins or externally loaded feature modules are introduced later.

## 18. Implementation outcome

The refactor described above was applied after this analysis document was created.

### 18.1 Engine outcome

- The 1,226-line `src/lib/pdf-operations.ts` monolith was removed.
- All nine user-facing operations now live in `src/modules/pdf/operations/<feature>/`.
- Every feature has a lightweight `definition.ts` that owns its option type and defaults.
- Each executor accepts `BinaryInput`, so mutation behavior can be tested with in-memory byte arrays rather than browser file inputs.
- `src/modules/pdf/operation-map.ts` is the single compile-time mapping among keys, options, and results.
- `src/modules/pdf/registry.ts` lazily loads executors. Neither the worker nor the compatibility facade contains a feature dispatch switch.
- Common loading and metadata behavior is limited to `src/modules/pdf/core/`; operation-specific save policy remains with each feature.
- Compression's `PDFDict`, `PDFRawStream`, indirect-object enumeration, and stream replacement are isolated in `operations/compress/enhancements.ts`.
- PDF.js and canvas/image infrastructure moved to `src/modules/pdf/infrastructure/`, separate from PDF mutation.

### 18.2 Worker outcome

- The old untyped worker client was removed.
- The 132-line feature switch/polyfill worker was replaced by a small generic protocol endpoint.
- Typed requests derive operation options/results from the operation map.
- The client accepts an injected `PdfWorkerLike` factory and ID factory for deterministic tests.
- `error`, `messageerror`, synchronous send failures, and termination settle and remove pending requests.
- Transferable buffers are collected centrally and deduplicated.
- Stable error codes survive worker serialization.
- Main-thread fallback is now limited to transport and runtime-capability failures; invalid/corrupt input is not parsed a second time.

### 18.3 Interface-decoupling outcome

- React presentation has no `pdf-lib`, `pdfjs-dist`, or worker-client import.
- `services.tsx` injects `PdfProcessorService`, `PdfDocumentService`, and `DownloadService` at the processor boundary.
- `PageSelector`, `PageOrderer`, `FileList`, `UnifiedCropInterface`, and `CompressionDiffSlider` consume the injected document port.
- The current feature workspaces for extract, crop, rotate, and reorder are separate presentation modules.
- Every feature's options form is a separate component selected by a 44-line `ProcessingOptions` registry.
- Feature order, accepted-file kind, minimum count, ordering behavior, page interaction, and defaults live in the lightweight PDF catalog rather than the UI shell.
- `src/components/pdf-processor/index.tsx` is a two-line composition export. Replacing that export is sufficient to introduce the redesigned processor while preserving engines and services.
- The current shell remains available as a compatibility UI during the redesign, with existing labels and selectors preserved.

### 18.4 Test outcome

- `bun run test:unit` was added and runs before production build/E2E in `verify-all.sh`.
- Fifteen fast tests cover operation contracts, byte-oriented image input, crop rotation mapping, signed rotation composition, extract/reorder ordering semantics, compression metrics, large Flate-stream backpressure, catalog completeness, lazy registry resolution, file acceptance, worker concurrency, stable error deserialization, transport cleanup, and worker recovery.
- The full Playwright suite passes twenty browser tests covering all nine operations, PDF.js, the application worker, ZIP output, corrupt PDFs, lossless and rigorous compression, thumbnail fidelity, and download behavior.
- The mandatory verification script passes lint, TypeScript, unit tests, the 112-page static production build, the full browser suite, and the Docker image build.

### 18.5 Deliberately unchanged dependency policies

To keep structural regressions attributable, this change does not alter:

- the `pdf-lib` package version or bundler alias;
- operation-specific object-stream save choices;
- the compatibility loader's `ignoreEncryption: true` behavior;
- compression's effective-DPI heuristic or supported PDF image-filter set;
- the current static-export/privacy model.

Those items remain explicit follow-ups requiring dedicated fixtures and behavior decisions rather than being hidden inside the refactor.
