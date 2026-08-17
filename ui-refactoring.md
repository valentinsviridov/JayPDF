# PDFLince UI Refactoring Document

Status: Proposed
Prepared: 2026-08-11

## 1. Introduction
This document outlines the UI refactoring plan for PDFLince, aiming for a fast.com-like experience: immediate, clear, privacy-first, quick, and straightforward. The redesign relies completely on the newly decoupled modular backend operations, maintaining the mandate of 100% local, client-side execution.

## 2. Current State
The current application suffers from excessive cognitive load on entry:
- Users are presented with a marketing hero and nine equal-weight operation buttons before selecting any files.
- The UI contains large component monoliths (e.g., `PDFProcessorShell.tsx` with ~2.2k lines).
- State transitions can silently filter incompatible files without notifying the user.
- A blocking processing dialog and automatic downloads remove user control from the output phase.
- Accessibility is incomplete (e.g., div-based drop zones, poor keyboard navigation).

## 3. Target Information Architecture
The application layout shifts from a "marketing page with embedded tools" to a direct "application-first" workspace.
- **Home/Workspace**: A universal Drop/Select Files entry point.
- **Advanced Settings**: Progressively disclosed. Only consequential settings are visible by default.
- **Help/Trust**: A consolidated area for FAQs and privacy information.
- **Operations (Deep Links)**: Existing localized operation routes (e.g., `/compress`) remain, serving as focused entry points into the unified workspace.

## 4. Workflows
- **One dominant first action**: The user uploads files.
- **Immediate local analysis**: The app infers the likely user intent based on the uploaded files.
  - *Single PDF*: Suggest Quick Optimize.
  - *Multiple PDFs*: Suggest Merge.
  - *Multiple Images*: Suggest Create PDF.
  - *Mixed Inputs*: Clear rejection or explanation instead of silent filtering.
- **Contextual Action Groups**: Replace the 9 raw functions with intent-based groups:
  - Make smaller
  - Combine
  - Organize pages (extract, rotate, reorder, crop)
  - Split
  - Convert

## 5. Components
The heavy `PDFProcessorShell.tsx` will be replaced with modular layers:
- `WorkspaceController`: Orchestrates the reducer and phase transitions.
- `UniversalDropzone`: Accessible file upload component.
- `ActionRecommendation`: Contextual suggestion based on file analysis.
- `FeaturePanels`: Lightweight UI adapters keyed by operation (e.g., crop bounds, rotation slider).
- `ResultStage`: Inline result summary, elapsed time, and explicit "Download" / "Download All" buttons.

## 6. State Model
The application will transition through a pure reducer with explicit phases:
1. `EMPTY`: Universal drop/choose-files stage.
2. `ANALYZING`: Local type/count/page analysis.
3. `READY`: Recommended action plus contextual alternatives.
4. `EDITING`: Page/image workspace only when required (e.g., cropping, organizing).
5. `PROCESSING`: Inline, honest indeterminate status.
6. `RESULT`: Explicit downloads, partial results, and start-over.
7. `ERROR`: Inline error and retry without destroying valid state.

*Note: The first redesign will focus on one operation at a time.*

## 7. Content/Route Migration
- **Preserve localized operation URLs**: Serve as focused deep-links into the workspace.
- **Consolidate FAQs**: Keep localized FAQ URLs as compatibility entries to a unified Help/Trust content section.
- **Remove Support Pages**: Remove dead support pages and associated unused translated content.
- **Clean unused fields**: Remove cookie banners, unused CTAs.

## 8. Accessibility
- Replace the div-based drop zone with a native label/button pattern supporting keyboard activation, visible focus, and live validation.
- Implement proper button/checkbox semantics for page selection.
- Make reordering robust for keyboard users (move earlier/later controls).
- Use live regions for processing and status announcements.
- Remove the blocking dialog in favor of inline results. Ensure any remaining dialogs use a focus trap.

## 9. Responsive Behavior
- Implement a single page scroll rather than fixed-height nested scrolling.
- Use a safe-area-aware sticky mobile action bar.
- Limit heavy animations and respect `prefers-reduced-motion`.

## 10. Privacy
Privacy is a core feature, explicitly stated near the upload and processing areas: "Your files stay on this device."
- Maintain strict local execution.
- Prevent telemetry from leaking file names or processing context.

## 11. Branding
- **Centralize Branding**: Create one configuration file for the product name, tagline, logo paths, and output naming conventions to replace scattered references.
- Select the new public name and domain separately in the future, while preserving current slugs and MIT license context for now.

## 12. Attribution
- Retain the MIT license and notice.
- Add a durable `NOTICE` or Attributions section.
- Expose a clear acknowledgment in Help/Trust and the footer: *"Based on PDFLince, originally created by Guillermo Siesto (GSiesto), and used under the MIT License. This independent fork is not affiliated with or maintained by the original author."*

## 13. Technical Boundaries
- **In-Memory Limits**: Display conservative capacity recommendations, avoiding hard promises on supported file sizes, as browser limits (e.g., V8 memory) apply.
- **Compression Preview**: Prepare only the active file automatically, debounce consequential option changes, and label it "Preparing locally" to indicate CPU cost.
- **Large Page Sets**: Virtualize or lazy-load thumbnails to maintain responsiveness.

## 14. Testing
- **Pure Unit Tests (Bun)**: Test workspace phase transitions, file eligibility, setting resets, and reducer logic.
- **Controller Tests**: Use injected fake processor and document services to test slow operations, worker fallback, and multi-file logic.
- **Browser Tests (Playwright)**: Test the accessible roles, one-to-multi-file paths, deep linking, error messaging, and mobile viewport behavior.

## 15. Rollout
1. Implement the central brand configuration.
2. Build the new `WorkspaceController` and state machine alongside existing code.
3. Migrate one feature UI adapter at a time.
4. Replace `PDFProcessorShell.tsx` and run E2E verifications.
5. Apply the simplified route and content changes.

## 16. Acceptance Criteria
- [ ] No regression in core PDF processing fidelity (verified via unit/E2E tests).
- [ ] `PDFProcessorShell.tsx` is completely replaced by the modular workspace phases.
- [ ] Lighthouse Accessibility score is 100, and keyboard-only navigation is functional.
- [ ] File analysis correctly recommends intent-based defaults.
- [ ] Dead content and routes (like Support) are removed.
- [ ] MIT attribution is visually present.
- [ ] The `verify-all.sh` script passes entirely.
