# UI refactor planning checkpoint

Checkpoint date: 2026-08-11

## 1. Purpose of this file

This file preserves the full state of the UI-refactoring investigation so a later worker can resume without repeating the repository audit.

The user asked to redesign the application from the UI point of view and first produce a detailed `ui-refactoring.md`. The requested experience should be close to fast.com: immediate, clear, privacy-first, quick, and straightforward, with important configuration available through progressive disclosure rather than displayed by default.

The user then explicitly asked to stop as soon as this checkpoint was written. Therefore:

- `state.md` is the only file created in this continuation.
- `ui-refactoring.md` has not been created yet.
- No UI implementation has started.
- Do not infer that the proposed product decisions below were explicitly approved; they are recommended defaults gathered during the audit.

## 2. Repository state at checkpoint start

- Repository: JayPDF
- Branch: `main`
- Baseline commit: `f224898 refactor: split PDF features into independent modules`
- The working tree was clean immediately before creating this file.
- The previous modular-backend refactor is committed and fully verified.
- A temporary Next.js development server used for visual inspection was stopped.
- Port 3000 was already occupied by an unrelated/unknown process during inspection, so the temporary server used port 3001.

The modular refactor already established:

- independent operation engines in `src/modules/pdf/operations/<feature>/`;
- a typed operation map and lazy registry;
- a generic typed worker protocol and testable worker client;
- injected processor, document, and download services;
- operation-level and worker-level unit tests;
- a two-line processor composition export;
- the detailed backend analysis in `monolith-split.md`.

The current browser and Docker verification baseline is:

- strict lint passed;
- TypeScript passed;
- 15 unit/contract tests passed;
- all 20 Playwright tests passed;
- 112 static pages built successfully;
- the Docker image built successfully.

## 3. Original UI-refactoring request

The product goal is an application people would love because it is:

- easy;
- clear;
- fast;
- direct;
- privacy-first;
- usable without learning the application's internal feature taxonomy;
- configurable when needed, with complexity as an opt-in;
- implementable on top of the current browser-only PDF services.

The user considers the current pattern—nine functions hidden behind or represented as equal buttons—to be flawed. Low-interest pages may be removed. The PDFLince name does not need to be retained because the fork is ready to become independent. The final refactoring document must explicitly recognize the original PDFLince author in accordance with the retained MIT license and the user's attribution request.

## 4. Work completed during the read-only audit

Three parallel, non-mutating audits were completed:

1. Current processor layout, state flow, accessibility, responsive behavior, and testability.
2. Route, content, navigation, localization, SEO, branding, and attribution surface.
3. Technical feasibility, fast.com interaction principles, current backend limitations, and MIT requirements.

Files and areas inspected include:

- `src/components/pdf-processor/PDFProcessorShell.tsx`;
- all current PDF feature workspaces and option components;
- uploader, file list, page selector, page orderer, crop interface, status dialog, and result cards;
- `HomePageContent`, `OperationPageContent`, `NavMenu`, `Footer`, FAQ, support, feedback, and 404 components;
- global styles and fonts;
- all route handlers and the localized route map;
- English and representative localized dictionaries;
- sitemap, robots, metadata, schemas, and static-export configuration;
- the PDF catalog, operation map, worker protocol, processor/document/download services, and rendering infrastructure;
- existing unit and Playwright tests;
- the local and original MIT license context.

One full-page desktop screenshot was captured at:

`/tmp/pdflince-home-desktop.png`

The `/tmp` artifact is ephemeral and may not survive a later environment. Mobile and operation-page screenshots were attempted but interrupted before completion and should be recaptured if visual evidence is needed.

## 5. Current user experience

### 5.1 Entry experience

The home page places a large marketing hero, four badges, and a mascot above the actual application. The processor then starts with another heading and nine equal-weight operation buttons.

This creates two layers before the user can perform the obvious first action: choose files. It also requires the user to understand product terminology such as extract, split, crop, reorder, and conversion direction before the application has any context about their files.

The generic home page defaults to Merge. A user selecting one PDF is not proactively guided to a compatible action; merge eligibility is only reported after attempting to process.

### 5.2 Operation selection

The nine operation buttons have:

- no grouping by user intent;
- no prioritization;
- no progressive disclosure;
- no tab semantics or `aria-selected` state;
- no meaningful keyboard tab-list behavior;
- unpredictable wrapping on small screens.

Dedicated operation URLs also render the entire nine-operation selector. A `/compress` visitor can switch the tool to Merge while the page hero, benefits, instructions, use cases, FAQ, metadata, and URL remain about compression. The content and active application state can therefore contradict one another.

### 5.3 Post-upload experience

After upload, the current shell may show:

- two Clear All controls;
- a fixed-height file list with nested scrolling;
- one or more feature-specific page workspaces;
- all available options at once;
- explanatory hints;
- compression preview cards;
- a primary action at the bottom of a potentially long page;
- a blocking processing/result dialog;
- automatic downloads.

The main action can end up far below the active page workspace, especially on mobile or for page selection/reordering.

### 5.4 UI controller complexity

`src/components/pdf-processor/PDFProcessorShell.tsx` is still approximately 2,192 lines. It contains:

- session file state;
- active mode and per-mode option persistence;
- duplicated active-file and per-file page selections;
- page ordering state;
- compression preview scheduling and caching;
- validation switches;
- execution switches;
- file naming;
- analytics;
- automatic download orchestration;
- dialog construction;
- feature rendering.

The PDF behavior is now modular and injectable, but the current interface controller remains difficult to reason about and test.

### 5.5 Mode-switching defects

Switching modes can silently filter incompatible files. For example, switching between PDF-to-images and images-to-PDF can remove files without a user decision. Other switching paths can preserve incompatible inputs and later send them into the wrong operation.

The future UI should use a neutral session file model. Incompatible files should be rejected with an explanation or visibly retained as incompatible; they must never disappear silently.

## 6. Accessibility and responsive findings

### 6.1 Upload

The current drop zone is a clickable `div` around a hidden input. It lacks complete native label/button behavior, keyboard activation, accessible error association, `aria-invalid`, and live status announcements.

The redesign should use a real label/button input pattern with:

- keyboard activation;
- a visible focus state;
- `aria-describedby`;
- live validation feedback;
- equivalent click, keyboard, and drag/drop behavior.

### 6.2 Page selection

Page thumbnails are clickable `div` elements without complete keyboard behavior or `aria-pressed`/checkbox semantics. Select All can produce one state update for every page.

Use button or checkbox semantics, batch selection updates, range selection as a first-class control, and announcements such as “Page 4 selected, 3 pages selected total.”

### 6.3 Reordering

Reordering relies heavily on HTML5 drag behavior, which is unreliable on touch and inaccessible without robust keyboard alternatives. Existing fallback buttons are small and move only one position.

Retain direct manipulation, but add:

- large touch targets;
- move earlier/later controls;
- an optional “Move to position” action;
- current-position announcements;
- keyboard-operable file/page selection.

### 6.4 Processing dialog

The current dialog restores focus and responds to Escape but does not fully trap focus or inert the background. A non-cancellable process can appear dismissible.

The recommended design removes the blocking dialog and presents processing/results inline. If a dialog remains anywhere, it must have a focus trap, labelled title/description, live status, and explicit dismissal policy.

### 6.5 Motion and layout

The stylesheet contains extensive pulse, fade, tilt, drag, and movement effects without a complete `prefers-reduced-motion` policy. Fixed-height nested scroll areas make mobile navigation harder.

Use one page scroll, a compact file tray, an active workspace, a safe-area-aware sticky mobile action, a small token system, and motion only when it explains state.

## 7. Performance and browser constraints

### 7.1 Existing services are sufficient

The existing UI-facing contracts are enough for a full redesign without modifying operation engines:

- `PdfProcessorService.execute()` runs a typed operation;
- `PdfDocumentService` supplies page count, dimensions, and thumbnails;
- `DownloadService` downloads result blobs;
- `PDF_FEATURES` supplies input kind, minimum file count, ordering policy, page interaction, and defaults;
- the React provider allows all services to be replaced by fakes in tests.

### 7.2 Honest progress only

The current worker protocol returns a final Promise. It does not expose:

- real percentage progress;
- streaming output;
- an abort signal;
- job cancellation.

The UI may show an indeterminate phase, elapsed time, and per-file completion. It must not show invented percentages or a non-functional Cancel action.

### 7.3 Memory limits

All files and results are held in browser memory. The current 2,000 MB uploader limit is misleading, while other project copy mentions approximately 50 MB and the README warns that very large PDFs can crash a browser tab.

The redesign should:

- avoid a hard promise about supported size;
- show a conservative recommendation;
- warn based on total selected size and available device-memory hints where supported;
- explain that capacity depends on the device/browser;
- avoid duplicate parsing, rendering, and compression.

### 7.4 Compression preview

The current “preview” performs complete compression and caches the finished result. Automatically previewing every file or recomputing on every option change can consume substantial CPU and memory.

Recommended behavior:

- prepare only the active/single file automatically;
- debounce consequential option changes;
- call the process “Preparing locally” rather than implying a cheap estimate;
- reuse the prepared result on confirmation;
- do not concurrently preview a whole batch.

### 7.5 Large page sets

The page selector initially renders only 20 thumbnails, while the reorder UI renders up to 120 pages and rejects larger visual reordering.

The new organizer should render only the active document and lazy-load or virtualize thumbnails. Preserve range entry for documents where thumbnails are intentionally limited. Either retain and clearly explain the 120-page visual-reorder boundary in the first redesign or replace it with a proven virtualized approach.

### 7.6 Canvas and formats

PDF rendering and image normalization rely on PDF.js, canvas, `OffscreenCanvas`, browser image decoding, and worker capability. TIFF/WebP acceptance does not guarantee successful decoding in every browser. Unsupported formats/capabilities need explicit, local error messages.

Encrypted PDFs are not genuinely decrypted by the current backend. Do not introduce a password input unless the engine contract changes.

### 7.7 Downloads

Results are complete in-memory blobs. Automatically firing multiple downloads may be blocked. The redesigned result stage should retain available blobs and offer explicit Download or Download All actions, with individual success/failure states and preserved partial results.

## 8. Route and content audit

### 8.1 Current route volume

Nine locales are enabled:

`es`, `pt`, `de`, `en`, `fr`, `hu`, `it`, `ro`, `ru`

The route map defines:

- 9 home routes;
- 9 FAQ routes;
- 9 support routes;
- 81 operation routes: 9 operations across 9 locales.

The static build produces 112 pages including application routes and generated system pages.

### 8.2 Static export constraint

`next.config.ts` uses `output: "export"` and `trailingSlash: true`. There is no runtime server, middleware, or server redirect layer.

Deleting or renaming routes requires either:

- keeping static compatibility pages;
- providing redirects in the deployment/hosting configuration;
- accepting broken existing links.

The recommended initial redesign preserves existing localized operation URLs as thin, focused entry points into the unified workspace.

### 8.3 High-confidence content removals

The support route family is already effectively dead:

- `SupportPageContent` calls `notFound()` in production;
- support pages are omitted from the sitemap;
- metadata marks them noindex/nofollow;
- donation prompts currently return `null`;
- support navigation is not rendered.

Remove the support routes, component, metadata, and large localized support content blocks.

The standalone FAQ can become a compact Help/Trust experience. Existing localized FAQ URLs may remain as compatibility entrances to that content or be redirected by the host later.

Operation routes should remain, but their repeated hero, mascot, benefits, instructions, use cases, and generic FAQ should be removed from the primary task flow. They should load the same application with the corresponding intent focused.

### 8.4 Dead or duplicative content

The audit found translated or implemented content with no active renderer, including:

- unused home CTA/callout fields;
- unused FAQ CTA fields;
- cookie-banner fields;
- feedback translations and the unreferenced feedback widget;
- a second unused FAQ dataset;
- unused support navigation fields;
- duplicate operation content exposure through dictionary metadata and page content.

Removing these reduces translation and rebrand cost substantially.

## 9. Correctness issues discovered during UI audit

These issues should be included in `ui-refactoring.md` and corrected during implementation:

1. Spanish dictionary routing derives locale identity from `DEFAULT_LOCALE` instead of explicitly using Spanish, producing incorrect routes and canonicals.
2. Localized layouts can emit duplicate title elements because layout markup and generated metadata both supply titles.
3. The custom 404 contains stale English and Spanish operation paths and omits Russian and Hungarian language choices.
4. `public/llms.txt` describes an older language and routing model.
5. German and Portuguese operation content contains extensive mojibake.
6. Some operation and FAQ marketing copy promises capabilities or fidelity the backend does not guarantee, including split options, bookmarks, links, forms, and aggressive preservation claims.
7. Global schema hardcodes the old brand and omits Crop and Rotate.
8. Breadcrumb, sitemap, robots, metadata, schemas, layouts, and OG assets independently hardcode the old name/domain.
9. Failure analytics may include actual filenames. Privacy-oriented analytics must use only coarse operation, count, duration bucket, success/failure, and stable error code—or be removed entirely.

## 10. Recommended product vision

### 10.1 Core principle

The homepage should be the application, not a marketing page placed before the application.

Translate the fast.com model as:

- one dominant first action;
- immediate local analysis after that action;
- one primary result/recommendation;
- advanced information and settings available on demand;
- no ads, registration, or distracting navigation;
- no automatic irreversible mutation where user intent is ambiguous.

Unlike fast.com, a PDF tool cannot safely start modifying a document before knowing the user's intent. The unavoidable trigger is selecting files, after which the application can analyze and recommend.

### 10.2 Proposed state model

Use a reducer/controller with explicit phases:

1. `EMPTY`: universal drop/choose-files stage.
2. `ANALYZING`: local type/count/page analysis.
3. `READY`: recommended action plus contextual alternatives.
4. `EDITING`: page/image workspace only when required.
5. `PROCESSING`: inline, honest indeterminate status.
6. `RESULT`: explicit downloads, partial results, and start-over.
7. `ERROR`: inline error and retry without destroying valid state.

### 10.3 File-informed recommendations

Recommended defaults:

- Multiple PDFs: recommend Merge.
- Multiple images: recommend Create PDF.
- A single PDF: recommend Quick Optimize, but do not run automatically.
- An operation deep link: preserve that operation as the focused intent after upload.
- Mixed PDF and image inputs: reject or explain the split clearly; never discard files silently.

### 10.4 User-facing action groups

Replace nine equal global buttons with contextual groups:

- Make smaller;
- Combine;
- Organize pages: extract, rotate, reorder, crop;
- Split;
- Convert.

Crop is a suitable lower-frequency action inside Organize Pages, not a homepage peer of compression or merge.

### 10.5 Progressive disclosure

Keep only consequential controls inline:

- file ordering for Merge and Images to PDF;
- page selection/ranges;
- rotation angle;
- crop region/margins;
- pages per split;
- format choice where necessary.

Place metadata, detailed DPI, image quality, base names, background, margins, and expert layout controls behind a collapsed “More settings” surface. Always show a short active-settings summary, for example:

`Balanced · metadata removed · images prepared at 150 DPI`

Defaults must never be hidden if they can remove metadata, annotations, quality, or interactivity.

### 10.6 Results

Replace the blocking modal and automatic downloads with an inline central result stage containing:

- clear success or partial-success status;
- original and result size where applicable;
- elapsed time;
- per-file result entries;
- explicit Download/Download All;
- Start Over;
- Retry for failed entries;
- a persistent local-processing assurance.

## 11. Suggested UI architecture

Keep the existing service injection and replace the current shell with:

- a pure workspace reducer/state machine;
- a `useWorkspaceController` orchestration hook;
- file eligibility and action recommendation derived from the catalog;
- feature UI adapters keyed by `PdfOperationKey`;
- thin stages such as Drop, Analyze, Ready, Edit, Process, Result, and Error;
- feature-owned essential controls and advanced-settings summaries;
- one session record keyed by stable file IDs;
- derived active-file selection rather than duplicated active/per-file state.

Do not combine multiple `copyPages`-style operations into an apparently atomic visual editor in the first redesign. Each run should execute one existing operation at a time. Chained editing can be designed later with explicit memory, fidelity, and failure semantics.

## 12. Branding and independence

The old name/domain currently appears across:

- header, footer, mascot, favicon, and OG images;
- nine locale layouts;
- metadata, sitemap, robots, schema, and breadcrumbs;
- localized page and operation copy;
- output file names and PDF-to-images base name;
- email addresses and source links;
- package/container/script names;
- README and project documentation;
- browser-storage keys.

Do not perform a scattered search-and-replace. First create one brand/site configuration containing:

- product name;
- short promise/tagline;
- canonical origin;
- contact address;
- independent source repository;
- original project repository;
- logo/favicon/OG asset paths;
- default output filename prefix;
- storage namespace.

Derive metadata, layouts, schemas, sitemap, robots, header/footer, output naming, and localized interpolation from this configuration.

Recommended sequencing:

1. Make the design brand-neutral and centralize every brand reference.
2. Choose the new name/domain in a separate product decision.
3. Preserve existing route slugs initially.
4. Replace public assets and canonical origins only when the deployment migration is defined.

## 13. Original-author and MIT recognition

The local README already identifies the project as a fork of `GSiesto/PDFLince`. Local Git history identifies the original author as Guillermo Siesto/GSiesto. The current local `LICENSE` contains the MIT permission text and a PDFLince copyright notice.

The MIT license requires the copyright and permission notice to remain in copies or substantial portions of the software. A visible product credit is not the literal placement requirement of MIT, but it is a deliberate and appropriate recognition requested by the user.

During rebranding:

- preserve the complete existing MIT notice;
- add the independent fork's copyright separately rather than replacing the retained notice;
- add a durable `NOTICE` or Attributions section;
- expose a concise acknowledgement in Help/Trust/About and the footer;
- link the new fork as the primary Source link;
- retain a distinct Original Project link;
- do not imply endorsement, affiliation, or continued maintenance by the original author.

Recommended wording:

> Based on PDFLince, originally created by Guillermo Siesto (GSiesto), and used under the MIT License. This independent fork is not affiliated with or maintained by the original author.

## 14. Privacy promise

Privacy should be an always-visible product property, not a collection of promotional badges.

Use concrete language near upload, processing, and results:

`Your files stay on this device.`

The implementation is local and has no processing endpoints, but future copy must avoid unsupported legal absolutes such as guaranteed GDPR compliance or guaranteed preservation of all PDF structures.

Before making a no-telemetry claim, remove or fully constrain the host-injected analytics path. Add a browser test asserting that file selection and processing send no document contents, filenames, or result data to external origins.

## 15. Testing strategy for the future redesign

### 15.1 Pure tests

Add Bun tests for:

- workspace phase transitions;
- file eligibility and input inference;
- recommended actions;
- incompatible/mixed inputs;
- per-file selection/order records;
- range parsing;
- settings defaults, summaries, reset, and persistence;
- partial success aggregation;
- retry and start-over behavior;
- result retention and explicit download decisions.

### 15.2 Controller tests

Use injected fake processor, document, and download services for:

- slow operations;
- corrupt documents;
- capability and transport failures;
- worker fallback;
- multiple results;
- partial failure;
- download behavior;
- compression preparation reuse.

### 15.3 Browser tests

Update Playwright tests to use accessible roles and user-facing behavior. Cover:

- one PDF, multiple PDFs, images, and mixed input;
- deep-link-focused intent;
- advanced settings closed by default;
- all nine operation paths;
- inline processing/result/error states;
- explicit Download and Download All;
- keyboard-only upload and page organization;
- focus and live-region behavior;
- mobile viewport;
- reduced-motion preference;
- WebKit capability smoke;
- all nine locale route smoke tests;
- backwards-compatible operation URLs;
- corrupt/encrypted/oversized messaging;
- same-origin/privacy network assertions;
- existing byte-level output validation.

Visual snapshots should cover Empty, Ready, Advanced Settings, Editing, Processing, Result, Error, and mobile equivalents.

## 16. Proposed defaults that still require product confirmation

Unless the user chooses otherwise, the detailed refactoring document should use these defaults:

1. Centralize branding during the redesign but select the new public name/domain separately.
2. Analyze and suggest Quick Optimize for a single PDF; never auto-run an ambiguous mutation.
3. Preserve all localized operation URLs as focused entries into the unified workspace.
4. Keep localized FAQ URLs as compatibility entries to consolidated Help/Trust content.
5. Remove the dead support pages.
6. Keep every operation engine, but demote lower-interest actions contextually rather than deleting functionality.
7. Build a one-operation-at-a-time organizer in the first redesign.
8. Use inline processing and results with explicit downloads.

## 17. Primary external references

- Fast.com launch principles: <https://about.netflix.com/en/news/now-available-globally-fast-com-a-new-tool-to-check-your-internet-speed>
- Current Fast.com experience: <https://fast.com/en/gb/>
- Fast.com progressive disclosure/advanced metrics: <https://about.netflix.com/en/news/fast-com-now-measures-latency-and-upload-speed>
- Canonical MIT license text: <https://opensource.org/license/mit>
- Original PDFLince repository: <https://github.com/GSiesto/PDFLince>
- Original PDFLince license: <https://github.com/GSiesto/PDFLince/blob/main/LICENSE>

## 18. Resume instructions

When work resumes:

1. Read this file, `monolith-split.md`, and the committed modular PDF service contracts.
2. Confirm whether the eight recommended defaults above are accepted or overridden.
3. Recapture current desktop and mobile states if screenshots are needed; `/tmp` artifacts may be gone.
4. Create `ui-refactoring.md` as the next and only requested deliverable.
5. Make that document decision-complete: current state, target information architecture, workflows, components, state model, content/route migration, accessibility, responsive behavior, privacy, branding, attribution, technical boundaries, testing, rollout, and acceptance criteria.
6. Review `ui-refactoring.md` with the user before implementing the UI redesign unless the user explicitly asks to proceed directly.

