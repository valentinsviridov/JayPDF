# JayPDF Architecture & Developer Guide

## 1. Overview & System Philosophy

**JayPDF** is a 100% client-side, privacy-first PDF utility web application built with Next.js, React, TypeScript, and Tailwind CSS. All PDF parsing, manipulation, rendering, compression, and image conversion occur exclusively within the user's browser (primarily inside Web Workers).

### 1.1 Privacy-First Mandate
- **Zero Server Processing**: No PDF bytes, image data, or extracted text are ever transmitted to any remote server.
- **Zero External Telemetry**: No third-party tracking scripts (such as Google Analytics or marketing pixels) exist in the codebase.
- **Local Asset Bundling**: All fonts, CMaps, workers, and images are bundled locally. No runtime CDNs or remote dependencies are contacted.
- **Static Export**: The application is compiled to a static HTML/JS/CSS bundle (`output: "export"` in Next.js) and served by an Nginx container or static file host.

### 1.2 Tech Stack
| Component | Technology | Role |
| --- | --- | --- |
| **Framework** | Next.js 16 (App Router) | Static site generation, localized routing, layout hierarchy |
| **UI Library** | React 19 | Workspace UI, progressive disclosure, accessible controls |
| **Language** | TypeScript 5.9 (Strict) | Compile-time type safety across operations and worker messages |
| **Styling** | Tailwind CSS & CSS Variables | Responsive, themeable UI with reduced-motion support |
| **Package Manager / Runtime** | Bun | Package management, script execution, fast unit testing |
| **PDF Mutation Engine** | `pdf-lib` (1.17.1) | Document assembly, page extraction, splitting, cropping, rotation, metadata |
| **PDF Rendering Engine** | `pdfjs-dist` (6.2.108) | Page inspection, thumbnail rendering, canvas rasterization |
| **Archive Utility** | `jszip` (3.10.1) | Client-side ZIP creation for PDF-to-Images exports |
| **E2E Testing** | Playwright | Full-pipeline browser automation and byte verification |

### 1.3 Project Heritage & Attribution
JayPDF is an independent, modular fork derived in part from **PDFLince** (originally created by Guillermo Siesto / GSiesto), maintained under the MIT License. In accordance with the MIT license and the project charter:
- The original MIT permission and copyright notices are preserved in [`LICENSE`](file:///home/alstein/projects/pdf-lince/LICENSE).
- Portions derived from PDFLince are explicitly attributed in the UI footer and metadata.
- The project is decoupled into an independent brand configuration located in [`src/config/brand.ts`](file:///home/alstein/projects/pdf-lince/src/config/brand.ts).

---

## 2. High-Level Architecture

The system is structured as a **modular monolith** with clear architectural boundaries separating UI presentation, service ports, background execution transport, lazy engine modules, and PDF core primitives:

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│                             Presentation Layer                              │
│  - Localized Next.js App Router Pages (en, de, es, fr, hu, it, pt, ro, ru) │
│  - WorkspaceShell & useWorkspace Reducer (EMPTY → READY → EDIT → RESULT)   │
│  - Specialized Workspaces (Crop, Rotate, Extract, Reorder, Options)        │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │ (Consumes React Context Ports)
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                           Service Inversion Ports                           │
│  - PdfProcessorService (UI-facing execution facade)                         │
│  - PdfDocumentService  (Thumbnail & page dimension provider via PDF.js)     │
│  - DownloadService     (Browser file download orchestration)                │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │
                    ┌──────────────────┴──────────────────┐
                    │ (Worker-First Execution)             │ (Local Fallback)
                    ▼                                     ▼
┌──────────────────────────────────────┐  ┌───────────────────────────────────┐
│     Worker Transport Layer           │  │   Direct Execution Pipeline       │
│  - PdfWorkerClient                   │  │   - executeLocally()              │
│  - Zero-copy ArrayBuffer Transfer    │  │   - Used when Worker unsupported  │
│  - Correlated Request/Response IDs   │  └─────────────────┬─────────────────┘
│  - src/workers/pdf.worker.ts         │                    │
└──────────────────┬───────────────────┘                    │
                   │                                        │
                   └───────────────────┬────────────────────┘
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                       Lazy Operation Registry Layer                         │
│  - src/modules/pdf/registry.ts (Dynamic import of operation modules)        │
│  - src/modules/pdf/operation-map.ts (Strict compile-time type map)          │
│  - src/modules/pdf/catalog.ts (Lightweight UI metadata, defaults, policy)   │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │
        ┌──────────────┬───────────────┼──────────────┬──────────────┐
        ▼              ▼               ▼              ▼              ▼
  ┌───────────┐  ┌───────────┐  ┌──────────────┐  ┌───────────┐  ┌───────────┐
  │  merge    │  │ compress  │  │ pdf-to-images│  │   crop    │  │  repair   │
  └─────┬─────┘  └─────┬─────┘  └──────┬───────┘  └─────┬─────┘  └─────┬─────┘
        │ (split, extract, rotate, reorder, images-to-pdf...)        │
        └──────────────────────────────┬─────────────────────────────┘
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                       Core Helpers & Infrastructure                         │
│  - src/modules/pdf/core/ (contracts, errors, byte conversion, pdf-lib)      │
│  - src/modules/pdf/infrastructure/ (PDF.js loading, Canvas/OffscreenCanvas) │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Modular PDF Engine (`src/modules/pdf/`)

Every PDF operation is encapsulated in its own self-contained directory under [`src/modules/pdf/operations/`](file:///home/alstein/projects/pdf-lince/src/modules/pdf/operations).

### 3.1 Design Principles
1. **No Inter-Operation Dependencies**: An operation module (e.g., `merge`) never imports another operation module (e.g., `split`).
2. **Byte-Oriented Contracts**: Engines accept `BinaryInput` (`Uint8Array`, `ArrayBuffer`, or objects implementing `arrayBuffer()`). They do not depend on browser `File` or `Blob` APIs, enabling fast, pure unit tests in Node or Bun.
3. **Dedicated Definition**: Each operation owns a lightweight `definition.ts` providing its TypeScript options interface and default parameters without importing heavy PDF libraries.
4. **Isolated Internals**: Low-level `pdf-lib` direct stream manipulations (such as indirect object iteration, `PDFRawStream`, `PDFDict`) are quarantined inside specific helper files (e.g., `enhancements.ts` in compression) and not exposed globally.

### 3.2 Supported Operations

| Operation | Module Directory | Input | Key Behavior | Output |
| --- | --- | --- | --- | --- |
| **`compress`** | `operations/compress/` | 1 PDF | Downscales image streams (DCT/Flate) via Canvas, strips metadata & annotations, yields ticks. | `CompressionResult` (bytes + metrics) |
| **`merge`** | `operations/merge/` | 2+ PDFs | Appends pages sequentially using `copyPages()`, inserts optional blank divider pages, sets title. | `Uint8Array` |
| **`split`** | `operations/split/` | 1 PDF | Divides document into chunks of $N$ pages (`pagesPerFile`). | `Uint8Array[]` |
| **`extract`** | `operations/extract/` | 1 PDF | Extracts specified 1-based page list in sorted order; preserves metadata. | `Uint8Array` |
| **`crop`** | `operations/crop/` | 1 PDF | Non-destructive margin clipping adjusting MediaBox, CropBox, BleedBox, TrimBox, and ArtBox across page rotations. | `Uint8Array` |
| **`rotate`** | `operations/rotate/` | 1 PDF | Applies signed quarter-turns (±90°, ±180°, ±270°) to selected pages, normalizing to 0..270°. | `Uint8Array` |
| **`reorder`** | `operations/reorder/` | 1 PDF | Reorganizes pages into an arbitrary sequence; supports page duplication. | `Uint8Array` |
| **`repair`** | `operations/repair/` | 1 PDF | Reconstructs damaged/malformed PDFs by ignoring corrupted xrefs/objects and reserializing. | `Uint8Array` |
| **`pdf-to-images`** | `operations/pdf-to-images/` | 1 PDF | Renders pages to PNG/JPEG canvases via PDF.js; optionally packages into a ZIP using JSZip. | `PdfToImagesResult` (Blobs or ZIP) |
| **`images-to-pdf`** | `operations/images-to-pdf/` | 1+ Images | Normalizes images (JPEG/PNG/WebP), calculates page aspect ratio (`contain`/`cover`), embeds into PDF. | `Uint8Array` |

---

## 4. Worker Execution & Transport Layer

CPU-intensive operations run in a dedicated Web Worker to maintain smooth 60 FPS UI interactivity.

### 4.1 Worker Protocol
- **Worker Script**: [`src/workers/pdf.worker.ts`](file:///home/alstein/projects/pdf-lince/src/workers/pdf.worker.ts) acts as a generic protocol endpoint. It imports the lazy operation registry instead of hardcoding a manual feature switch.
- **Client Client**: [`src/modules/pdf/worker-client.ts`](file:///home/alstein/projects/pdf-lince/src/modules/pdf/worker-client.ts) manages worker instantiation, request correlation using unique request IDs, and promise settlements.
- **Zero-Copy Transfers**: Input `ArrayBuffer`s and output byte arrays are placed in the `postMessage` transfer list, avoiding expensive memory copies.

### 4.2 Error Handling & Fallback Model
- **Stable Error Serialization**: Domain errors (e.g., `CORRUPT_PDF`, `ENCRYPTED_PDF`, `INVALID_INPUT`) retain error codes and diagnostic details across the worker boundary.
- **Intelligent Fallback**: The client only falls back to main-thread execution if a **transport/capability failure** occurs (e.g., Web Workers disabled in environment, worker crash). Deterministic validation or corrupt-file errors are **not** re-executed on the main thread.
- **Lifecycle Cleanup**: On worker crash (`onerror`, `onmessageerror`) or termination, all pending promises are rejected immediately to prevent memory leaks or hanging promises.

---

## 5. UI Architecture & State Machine

The user interface in [`src/components/pdf-processor/`](file:///home/alstein/projects/pdf-lince/src/components/pdf-processor) is built around a centralized reducer and workspace controller ([`useWorkspace`](file:///home/alstein/projects/pdf-lince/src/components/pdf-processor/controller/use-workspace.ts)).

### 5.1 Workspace Phases
The workspace moves through explicit lifecycle stages:

```text
 ┌─────────┐     Upload Files     ┌─────────┐     Local Analysis     ┌─────────┐
 │  EMPTY  │ ───────────────────> │  READY  │ ─────────────────────> │ EDITING │
 └─────────┘                      └─────────┘                        └────┬────┘
      ▲                                ▲                                  │
      │ Start Over                     │ Change Options / Retry           │ Run Operation
      │                                │                                  ▼
 ┌────┴────┐     Download / Done  ┌────┴────┐      Execution Loop    ┌────────────┐
 │ RESULT  │ <─────────────────── │  ERROR  │ <───────────────────── │ PROCESSING │
 └─────────┘                      └─────────┘                        └────────────┘
```

1. **`EMPTY`**: Universal accessible drag-and-drop dropzone ([`FileUploader.tsx`](file:///home/alstein/projects/pdf-lince/src/components/pdf-processor/FileUploader.tsx)).
2. **`READY`**: Analyzes file count and types:
   - Multiple PDFs $\to$ Recommends **Merge**.
   - Multiple Images $\to$ Recommends **Images to PDF**.
   - Single PDF $\to$ Recommends **Compress** (or focused deep-linked route operation).
3. **`EDITING`**: Renders contextual interactive tools when required:
   - Visual page organizer ([`PageSelector.tsx`](file:///home/alstein/projects/pdf-lince/src/components/pdf-processor/PageSelector.tsx), [`PageOrderer.tsx`](file:///home/alstein/projects/pdf-lince/src/components/pdf-processor/PageOrderer.tsx))
   - Visual crop overlay ([`UnifiedCropInterface.tsx`](file:///home/alstein/projects/pdf-lince/src/components/pdf-processor/UnifiedCropInterface.tsx))
   - Rotation controls ([`RotateWorkspace.tsx`](file:///home/alstein/projects/pdf-lince/src/components/pdf-processor/features/RotateWorkspace.tsx))
4. **`PROCESSING`**: Displays truthful progress ([`InsightfulProgressIndicator.tsx`](file:///home/alstein/projects/pdf-lince/src/components/pdf-processor/InsightfulProgressIndicator.tsx)) indicating stages, elapsed time, and per-file progress without fake percentages.
5. **`RESULT`**: Inline presentation of output files, size reductions, compression savings, and explicit individual / batch download buttons.
6. **`ERROR`**: Non-blocking inline errors with actionable recovery (e.g., 1-click **"Fix with Auto-Repair & Retry"** button for corrupted files).

### 5.2 Dynamic & Smart File Naming (`src/lib/filename.ts`)
Generated output files follow a predictable, unique naming convention that avoids collisions and includes operation context:
- Standard pattern: `[OriginalName]_[operation]_[Brand]_[YYYYMMDD_HHMMSS].[ext]`
- Example (Merge): `report_merged_JayPDF_20260818_011432.pdf`
- Example (Split): `document_part_1_JayPDF_20260818_011554.pdf`

---

## 6. Internationalization & Routing

### 6.1 Supported Locales
JayPDF supports 9 languages:
- English (`en` - Default)
- German (`de`)
- Spanish (`es`)
- French (`fr`)
- Hungarian (`hu`)
- Italian (`it`)
- Portuguese (`pt`)
- Romanian (`ro`)
- Russian (`ru`)

### 6.2 Localized Route Structure
Next.js App Router directory layout:
```text
src/app/
  (en)/                      # English root (/)
    (operations)/[operation] # /merge, /compress, /split, etc.
    faq/                     # /faq
  de/                        # German root (/de)
    [operation]/             # /de/zusammenfuehren, /de/komprimieren, etc.
    haeufige-fragen/         # /de/haeufige-fragen
  es/                        # Spanish root (/es)
    [operation]/             # /es/unir, /es/comprimir, etc.
  ... (fr, hu, it, pt, ro, ru)
```

### 6.3 Domain-Agnostic Hosting
All canonical links, OpenGraph metadata, and `hreflang` alternate links are specified as **relative paths**. Next.js resolves them against `metadataBase`, which dynamically defaults to:
```ts
process.env.NEXT_PUBLIC_SITE_URL || "https://jaypdf.org"
```
In the browser client, all navigation and API schemas dynamically use `window.location.origin`.

---

## 7. Testing & Quality Assurance

JayPDF maintains a rigorous, multi-tiered testing strategy.

```text
                     ▲
                    / \
                   /   \
                  / E2E \           Playwright Browser Tests (22 specs)
                 /-------\          Full pipeline, UI, Web Workers, Canvas, Downloads
                / Contro- \
               /   ller    \        Fake service injection tests (React testing)
              /-------------\
             /   Operation   \      Operation Contract Tests (Uint8Array byte assertions)
            /    Contracts    \     pdf-lib memory fixtures, corrupt recovery, crop boxes
           /-------------------\
          /      Unit Tests     \   Pure helper tests (filename, math, reducer, locales)
         /_______________________\  Run via `bun test` in < 2 seconds
```

### 7.1 Unit & Contract Tests (`tests/unit/`)
- Run with `bun test`.
- Exercises pure reducer transitions, localized route maps, filename generation, and direct byte mutations across all operations.

### 7.2 End-to-End Tests (`tests/e2e/`)
- Run with Playwright (`bun run test:e2e`).
- Covers real Web Worker lifecycle, PDF.js thumbnail generation, corrupted PDF recovery, lossless image compression, manual crop coordinate mapping, and multi-file drag-and-drop.

### 7.3 Verification Script
**Mandatory**: Before opening a pull request or pushing commits, run:
```bash
./scripts/verify-all.sh
```
This script executes:
1. `bun run lint` (ESLint strict check)
2. `bun run typecheck` (TypeScript compiler validation)
3. `bun test` (Unit and contract test suite)
4. `bun run build` (Next.js production build of 112 static pages)
5. `bun run test:e2e` (Playwright browser test suite)
6. `docker build` (Production Nginx container build)

---

## 8. Extension Guide: Adding a New Operation

Follow this step-by-step recipe to add a new PDF operation (e.g., `watermark`):

### Step 1: Create Operation Module
Create `src/modules/pdf/operations/watermark/`:
1. `definition.ts`:
   ```ts
   export interface WatermarkOptions {
     text: string;
     opacity: number;
   }
   export const DEFAULT_WATERMARK_OPTIONS: WatermarkOptions = {
     text: "CONFIDENTIAL",
     opacity: 0.5,
   };
   ```
2. `index.ts`:
   ```ts
   import type { PdfOperationModule } from '../../core/contracts';
   import { loadPdfDocument } from '../../core/pdf-lib';
   import type { WatermarkOptions } from './definition';

   export const watermarkOperation: PdfOperationModule<WatermarkOptions, Uint8Array> = {
     key: 'watermark',
     async execute(inputs, options) {
       const doc = await loadPdfDocument(inputs[0]);
       // Apply watermark using pdf-lib...
       return doc.save();
     },
   };
   ```

### Step 2: Register in Engine Type Maps
1. Add to [`src/modules/pdf/operation-map.ts`](file:///home/alstein/projects/pdf-lince/src/modules/pdf/operation-map.ts):
   ```ts
   export interface PdfOperationMap {
     // ... existing operations
     watermark: { options: WatermarkOptions; result: Uint8Array };
   }
   ```
2. Add catalog entry in [`src/modules/pdf/catalog.ts`](file:///home/alstein/projects/pdf-lince/src/modules/pdf/catalog.ts):
   ```ts
   watermark: {
     key: 'watermark',
     acceptedInputKind: 'pdf',
     minFileCount: 1,
     maxFileCount: 1,
     defaultOptions: DEFAULT_WATERMARK_OPTIONS,
   }
   ```
3. Add lazy loader in [`src/modules/pdf/registry.ts`](file:///home/alstein/projects/pdf-lince/src/modules/pdf/registry.ts):
   ```ts
   watermark: async () => (await import('./operations/watermark')).watermarkOperation,
   ```

### Step 3: Add Unit Contract Tests
In [`tests/unit/pdf/operations.test.ts`](file:///home/alstein/projects/pdf-lince/tests/unit/pdf/operations.test.ts), add a test generating an in-memory PDF, executing the operation, and asserting document correctness.

### Step 4: Add UI Option Panel
Create `src/components/pdf-processor/features/options/WatermarkOptions.tsx` and register it inside [`ProcessingOptions.tsx`](file:///home/alstein/projects/pdf-lince/src/components/pdf-processor/ProcessingOptions.tsx).

### Step 5: Add Localized Dictionaries & Routes
1. Add dictionary labels in [`src/i18n/dictionaries/dictionary-types.ts`](file:///home/alstein/projects/pdf-lince/src/i18n/dictionaries/dictionary-types.ts) and all 9 locale index files (`src/i18n/dictionaries/*/index.ts`).
2. Add localized route paths in [`src/i18n/routing.ts`](file:///home/alstein/projects/pdf-lince/src/i18n/routing.ts).

### Step 6: Verify
Run `./scripts/verify-all.sh` to ensure all tests, static builds, and Docker packaging pass cleanly.
