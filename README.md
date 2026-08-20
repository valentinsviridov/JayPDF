# JayPDF (Privacy-First)

This project is a privacy-focused derivative and independent fork of the original [GSiesto/PDFLince](https://github.com/GSiesto/PDFLince) project.

## 🎯 Goals of JayPDF

1. **Privacy First**: All third-party tracking, telemetry, and external asset loading have been removed. Everything runs locally and completely within the browser.
2. **Easy Deployment**: The application is packaged and distributed as a lightweight Docker image for seamless self-hosting.
3. **Robust Processing**: Expanded tools for PDF repair, batch operations, resilient offline execution, and client-side performance.

## 🔒 Privacy

JayPDF is designed to process documents locally in your browser.

- PDF files are processed client-side.
- Documents are not uploaded to a JayPDF processing server.
- No Google Analytics.
- No behavioral analytics.
- No advertising SDKs.
- No tracking pixels.
- No document-content telemetry.
- No account is required for local PDF processing.

## 🚀 Getting Started

### Clone and Run Locally

```bash
git clone git@github.com:valentinsviridov/JayPDF.git
cd JayPDF
bun install
bun run setup-worker
bun run dev
```

### Run with Docker

You can pull and run the pre-built Docker image directly from the GitHub Container Registry (GHCR):

```bash
docker run -d -p 3000:3000 ghcr.io/valentinsviridov/jaypdf:latest
```

The application will be available locally at `http://localhost:3000`.

---

## 🏗 Architecture & Onboarding Guide

Welcome to the **JayPDF** project! This document provides a comprehensive overview of the application's architecture, development tools, core dependencies, and current limitations.

### 1. Global Architecture Overview

JayPDF is a **Privacy-First, Client-Side PDF Toolkit**. The primary architectural mandate is that **all PDF processing happens 100% locally within the user's browser**. No PDF data is ever transmitted to a remote server.

#### 1.1. High-Level Topology
- **Framework**: Next.js 14+ (App Router) using React 19.
- **Hosting/Deployment**: The application is built as a completely static site (`next build` -> static export into `out/`). It can be hosted on any static web server (e.g. Nginx, Cloudflare Pages, S3, etc.).
- **Execution Model**:
  - The UI runs on the main browser thread.
  - Heavy PDF manipulations are offloaded to **Web Workers** (`src/workers/pdf.worker.ts`) to prevent blocking the main thread and ensure a smooth user experience.
  - Deterministic fallbacks to the main thread exist for operations requiring APIs not available in workers (or in older browsers).

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

### 2. The PDF Processor Engine

JayPDF is organized as a modular monolith. Presentation components compose features, while PDF behavior is isolated under `src/modules/pdf/operations/`. Each operation owns a narrow options type, defaults, validation, execution function, and result type.

The UI never imports `pdf-lib`, PDF.js, or the worker client directly. `src/components/pdf-processor/services.tsx` injects three ports:

- `PdfProcessorService` executes typed operations and adapts byte results to browser artifacts;
- `PdfDocumentService` provides page counts, dimensions, and thumbnails;
- `DownloadService` owns browser download side effects.

#### 2.1. Feature and presentation layout

- **`src/modules/pdf/operations/<feature>/`**: independent engines for merge, compress, split, extract, crop, rotate, reorder, repair, PDF-to-images, and images-to-PDF.
- **`src/modules/pdf/registry.ts`**: lazy operation loaders shared by worker and local execution.
- **`src/modules/pdf/operation-map.ts`**: the compile-time key/options/result contract.
- **`src/modules/pdf/infrastructure/`**: PDF.js and canvas adapters, separate from PDF mutation.
- **`src/components/pdf-processor/features/`**: current feature workspaces and independent option panels.
- **Shared presentation**: upload, file list, page selector/orderer, status dialog, and compression result cards.

---

### 3. Core Dependencies & Their Purposes

- **`pdf-lib`**: The primary engine for mutating PDFs (merging, splitting, rotating, extracting pages, generating new PDFs).
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

## 📱 Progressive Web App (PWA) & Offline Support

JayPDF is fully installable as a **Progressive Web App (PWA)** on mobile devices and desktop computers, offering seamless offline execution:

- **Add to Home Screen**: Install JayPDF directly from your mobile browser (Safari on iOS: tap *Share* -> *Add to Home Screen*; Chrome on Android: tap the menu -> *Install app* / *Add to Home screen*).
- **100% Offline Capability**: Once cached, all PDF tools (merge, compress, split, extract, rotate, reorder, crop, repair, and image conversions) operate completely offline without an active internet connection.
- **Privacy & Local Isolation**: All assets and service workers run strictly on-device with zero external calls or telemetry.

*This feature was proposed by **Alexandra Omelchenko**.*

---

## 📄 License

JayPDF uses a dual-licensing model.

### Open source

JayPDF is available under the
[GNU Affero General Public License v3.0 only](LICENSES/AGPL-3.0-only.txt).

You may use, modify, self-host, and redistribute JayPDF subject to
the terms of the AGPL-3.0-only.

### Commercial license

Organizations that want to use JayPDF-owned code under terms other
than the AGPL may obtain a separate commercial license from the
JayPDF copyright holder.

See [COMMERCIAL-LICENSE.md](COMMERCIAL-LICENSE.md).

### Upstream attribution

JayPDF contains portions derived from
[PDFLince](https://github.com/GSiesto/PDFLince), originally created
by Guillermo Siesto and distributed under the MIT License.

The original MIT copyright and license notice is preserved in
[LICENSES/MIT-PDFLince.txt](LICENSES/MIT-PDFLince.txt).

JayPDF is an independent project and is not affiliated with or
endorsed by the PDFLince project or its maintainer.

