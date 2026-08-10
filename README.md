# PDFLince (Privacy-First)

This project is a privacy-focused fork of the original [GSiesto/PDFLince](https://github.com/GSiesto/PDFLince) project.

## 🎯 Goals of this Fork

1. **Privacy First**: We have removed all third-party tracking and external asset loading. This includes the complete removal of Google Analytics (GA) integration and external Google Fonts. Everything runs locally and completely within the browser.
2. **Easy Deployment**: The application is packaged and distributed as a lightweight Docker image for seamless hosting.

## 🚀 Getting Started

You can pull and run the pre-built Docker image directly from the GitHub Container Registry (GHCR):

```bash
docker run -d -p 3000:3000 ghcr.io/valentinsviridov/pdflince:latest
```

The application will be available locally at `http://localhost:3000`.

---

## 🏗 Architecture & Onboarding Guide

Welcome to the **PDFLince** project! This document provides a comprehensive overview of the application's architecture, development tools, core dependencies, and current limitations. It is designed to quickly onboard developers, software architects, and security assessment professionals.

### 1. Global Architecture Overview

PDFLince is a **Privacy-First, Client-Side PDF Toolkit**. The primary architectural mandate is that **all PDF processing happens 100% locally within the user's browser**. No PDF data is ever transmitted to a remote server.

#### 1.1. High-Level Topology
- **Framework**: Next.js 14+ (App Router) using React 19.
- **Hosting/Deployment**: The application is built as a completely static site (`next build` -> static export into `out/`). It can be hosted on any static web server.
- **Execution Model**:
  - The UI runs on the main browser thread.
  - Heavy PDF manipulations are offloaded to **Web Workers** (`src/workers/pdf.worker.ts`) to prevent blocking the main thread and ensure a smooth user experience.
  - Fallbacks to the main thread exist for operations requiring APIs not available in workers (or in older browsers).

#### 1.2. Directory Structure
- `src/app/`: Next.js App Router structure. Contains localized routes (e.g., `(en)`, `es`, `fr`) and dynamic operation routes (`[operation]`).
- `src/components/`: Reusable React presentation components and feature workspaces.
- `src/modules/pdf/`: Typed PDF feature modules, byte-level primitives, PDF.js infrastructure, the lazy registry, and browser service ports.
- `src/lib/`: Small compatibility facades and general utilities; feature engines do not live here.
- `src/workers/`: Contains the generic `pdf.worker.ts` protocol endpoint, which uses the same lazy registry as local execution.
- `src/i18n/`: Internationalization configuration and dictionaries.
- `tests/unit/`: Fast byte-level operation, registry, and worker lifecycle tests.
- `tests/e2e/`: Playwright browser, rendering, worker, UI, and download tests.

---

### 2. The Application Itself & The PDF Processor Engine

PDFLince is organized as a modular monolith. Presentation components compose features, while PDF behavior is isolated under `src/modules/pdf/operations/`. Each operation owns a narrow options type, defaults, validation, execution function, and result type. Compression additionally quarantines low-level `pdf-lib` stream handling in its own `enhancements.ts`.

The UI never imports `pdf-lib`, PDF.js, or the worker client. `src/components/pdf-processor/services.tsx` injects three ports:

- `PdfProcessorService` executes typed operations and adapts byte results to browser artifacts;
- `PdfDocumentService` provides page counts, dimensions, and thumbnails;
- `DownloadService` owns browser download side effects.

Tests and a future UI can replace all three with fakes.

#### 2.1. Feature and presentation layout

- **`src/modules/pdf/operations/<feature>/`**: independent engines for merge, compress, split, extract, crop, rotate, reorder, PDF-to-images, and images-to-PDF.
- **`src/modules/pdf/registry.ts`**: lazy operation loaders shared by worker and local execution.
- **`src/modules/pdf/operation-map.ts`**: the compile-time key/options/result contract.
- **`src/modules/pdf/infrastructure/`**: PDF.js and canvas adapters, separate from PDF mutation.
- **`src/components/pdf-processor/features/`**: current feature workspaces and independent option panels.
- **Shared presentation**: upload, file list, page selector/orderer, status dialog, and compression result cards.

#### 2.2. Event flow

1. A feature workspace updates interface state such as selected pages or crop margins.
2. The processor shell calls the injected `PdfProcessorService` with a typed operation key and feature options.
3. The service sends a typed request to the application Web Worker.
4. The worker lazily loads only the requested operation and returns a typed result; byte buffers are transferred.
5. Transport or capability failures can use the same registry locally. Deterministic document and validation errors return directly instead of repeating the work.
6. The UI updates its result state and delegates downloads to `DownloadService`.

See [`monolith-split.md`](./monolith-split.md) for the dependency analysis, `pdf-lib` constraints, architectural decisions, and extension recipe.

#### 2.3. Security & Privacy Posture
- **Zero Data Exfiltration**: There are no API endpoints for processing.
- **No External Trackers**: Google Analytics and other third-party remote tracking scripts are strictly prohibited.
- **Local Assets**: All fonts and icons are bundled locally.

---

### 3. Core Dependencies & Their Purposes

- **`pdf-lib`**: The primary engine for mutating PDFs (merging, splitting, rotating, extracting pages, generating new PDFs). It is pure JavaScript/TypeScript and runs well in Web Workers.
- **`pdfjs-dist`**: Mozilla's PDF.js library. Used primarily for parsing PDFs, rendering PDF pages to images (thumbnails for the UI), and extracting complex metadata.
- **`jszip`**: Used for bundling multiple output files (e.g., when converting a PDF to multiple Images, it packages them into a `.zip` file client-side).
- **`next`** & **`react`**: The core framework. Used strictly for static site generation and component architecture.
- **`tailwindcss`**: Utility-first CSS framework for styling.

---

### 4. Development Tools (DevX)

- **Package Manager**: **`bun`** is the mandatory package manager and script runner. Do not use `npm` or `yarn`.
- **Linting & Formatting**: `eslint` and `prettier`.
- **Testing**: Bun unit/operation contract tests cover byte-level behavior and worker lifecycle; **`@playwright/test`** covers browser workers, canvas/PDF.js rendering, UI, and downloads.
- **Verification Script**: `./scripts/verify-all.sh` must be run before finalizing any code. It runs type-checking, linting, builds, Playwright tests, and Docker builds.

---

### 5. Known Limitations & Tradeoffs

- **Browser Memory Limits**: Processing massive PDFs (e.g., 500MB+) may crash the browser tab due to V8 engine memory limits.
- **Web Worker & Canvas capabilities**: Rendering and image normalization use `OffscreenCanvas` in the worker when available. Typed transport/capability failures may fall back to the main thread, where very large work can affect responsiveness.
- **Static Export Restrictions**: Next.js features requiring a Node server (API Routes, Server Actions, Middleware) are completely unsupported due to the `next export` configuration.
- **PDF fidelity boundaries**: Operations that construct a new document with `pdf-lib.copyPages` do not promise preservation of every document-level structure such as all outlines, forms, attachments, or named destinations.
- **Compression scope**: Image optimization handles a deliberately limited set of PDF image streams and relies on quarantined `pdf-lib` core-object APIs; review its contract tests and `monolith-split.md` before upgrading `pdf-lib`.
