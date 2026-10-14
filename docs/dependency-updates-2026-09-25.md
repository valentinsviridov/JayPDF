# Dependency review — 2026-09-25

Updates use stable releases published by **2026-09-23 07:22:04 UTC**, at least 48 hours before this review began. Publication dates were checked against npm registry metadata. All 86 newly resolved npm versions, including transitive packages, passed this cutoff.

`bunfig.toml` enforces a rolling 172,800-second minimum age for future npm resolutions. Both Dockerfiles copy it before installing dependencies. Frozen installs retain the reviewed lockfile; the age rule does not retroactively change existing locked versions. See [Bun’s minimum release age documentation](https://bun.sh/docs/pm/cli/install#minimum-release-age).

## Direct npm updates

| Package | Previous | Updated | Published (UTC) |
| --- | --- | --- | --- |
| `@t3-oss/env-nextjs` | 0.10.1 | 0.13.11 | 2026-03-22 |
| `baseline-browser-mapping` | 2.11.12 | 2.11.25 | 2026-09-17 |
| `caniuse-lite` | 1.0.30001809 | 1.0.30001810 | 2026-08-24 |
| `lucide-react` | 0.563.0 | 1.47.0 | 2026-09-17 |
| `next` | 16.2.12 | 16.3.6 | 2026-09-22 |
| `pdfjs-dist` | 6.2.108 | 6.3.289 | 2026-08-29 |
| `react` | 19.2.8 | 19.3.0 | 2026-09-09 |
| `react-dom` | 19.2.8 | 19.3.0 | 2026-09-09 |
| `zod` | 4.4.3 | 4.6.5 | 2026-09-13 |
| `@eslint/eslintrc` | 3.3.6 | 3.3.7 | 2026-09-01 |
| `@playwright/test` | 1.62.1 | 1.63.0 | 2026-09-04 |
| `@types/eslint` | 8.56.12 | 9.6.1 | 2024-08-26 |
| `@types/node` | 20.19.43 | 22.20.4 | 2026-09-19 |
| `@types/react` | 18.3.31 | 19.3.0 | 2026-09-09 |
| `@types/react-dom` | 18.3.7 | 19.3.0 | 2026-09-09 |
| `@typescript-eslint/eslint-plugin` | 8.66.0 | 8.70.1 | 2026-09-21 |
| `@typescript-eslint/parser` | 8.66.0 | 8.70.1 | 2026-09-21 |
| `autoprefixer` | 10.5.4 | 10.6.1 | 2026-09-15 |
| `cross-env` | 7.0.3 | 10.1.0 | 2025-09-29 |
| `eslint-config-next` | 16.3.0 | 16.3.6 | 2026-09-22 |
| `jszip` | 3.10.1 | 3.10.2 | 2026-09-08 |
| `postcss` | 8.5.26 | 8.5.28 | 2026-09-03 |
| `prettier` | 3.9.6 | 3.9.9 | 2026-09-23 |
| `prettier-plugin-tailwindcss` | 0.6.14 | 0.8.1 | 2026-07-15 |
| `typescript` | 5.9.3 | 6.0.3 | 2026-04-16 |

25 direct npm packages updated. React types now match React 19, and Node types match the Node 22 verification image. Removed deprecated `@types/jszip`; JSZip supplies its own types. TypeScript 6 required replacing the JSON import assertion with an import attribute in `src/i18n/routing.ts`.

## Android updates

| Dependency | Previous | Updated | Published |
| --- | --- | --- | --- |
| Activity | 1.10.1 | 1.13.0 | 2026-03-11 |
| WebKit | 1.14.0 | 1.17.0 | 2026-08-12 |
| Core | 1.16.0 | 1.18.0 | 2026-03-11 |
| AndroidX Test JUnit | 1.2.1 | 1.3.0 | 2025-07-30 |
| AndroidX Test Runner | 1.6.2 | 1.7.0 | 2025-07-30 |
| AndroidX Test Rules | 1.6.1 | 1.7.0 | 2025-07-30 |
| Gradle wrapper | 8.13 | 8.14.5 | 2026-05-07 |

Android release dates come from the official [Activity](https://developer.android.com/jetpack/androidx/releases/activity), [WebKit](https://developer.android.com/jetpack/androidx/releases/webkit), [Core](https://developer.android.com/jetpack/androidx/releases/core), [Test](https://developer.android.com/jetpack/androidx/releases/test), and [Gradle](https://services.gradle.org/versions/all) release records. Library AAR metadata was also checked for SDK and build-plugin compatibility. The app retains minSdk 26, compile/target SDK 36, JDK 17, and AGP 8.13.2. The wrapper distribution and JAR checksums are verified against Gradle’s published values.

## Versions held back

- `baseline-browser-mapping` 2.11.26, `caniuse-lite` 1.0.30001812, and `lucide-react` 1.48.0 were too new for the cutoff. The latest eligible versions are installed.
- Tailwind stays at 3.4.19 to preserve older-browser support. [Tailwind 4 requires newer browser versions](https://tailwindcss.com/docs/upgrade-guide#browser-requirements), including Safari 16.4 and Chrome 111.
- ESLint stays at the already resolved 9.39.5: `eslint-plugin-react` 7.37.5 declares support through ESLint 9, not 10. Its supported peer range was checked in npm metadata.
- TypeScript uses `~6.0.3`, because the current [typescript-eslint support range](https://typescript-eslint.io/users/dependency-versions/) ends below 6.1; TypeScript 7 requires a later tooling migration.
- Node type definitions stay on the Node 22 major used by verification, rather than describing APIs from Node 26.
- Android Core 1.19 requires compile SDK 37 and AGP 9.1.0, so Core 1.18 is used with the existing SDK. AGP 8.13.2 is the latest stable 8.x release.
- WebKit 1.17.1 and Core 1.19.1 are dated September 23; their published dates alone do not establish 48 full hours at this review’s morning cutoff. WebKit 1.17.0 is used.

## Validation

- `./scripts/verify-all.sh` passed in Docker: lint, TypeScript checks, production web build, 34 unit tests, 31 end-to-end tests, and 9 save compatibility tests. Three picker-specific cases are intentionally skipped where the picker is unavailable. The production `jaypdf:local` image also built successfully.
- `bun run android:prepare` rebuilt the bundled application with the updated dependencies. The packaged-app browser smoke test passed in Docker, covering PDF merge/export and PDF-to-images ZIP export through a simulated Android bridge.
- Gradle 8.14.5 completed `assembleDebug assembleDebugAndroidTest lintDebug` with JDK 17. Lint reported no errors and two warnings: the existing WebView lacks a renderer-crash handler, and the launcher icon lacks a monochrome variant.
- The rebuilt APK passed the privacy/package audit: no Android system permissions, no native `.so` libraries, and all required offline assets present. Its minimum SDK remains 26 and target SDK remains 36.
- All 86 new npm resolutions passed the publication-time audit. The Gradle wrapper JAR matches the official SHA-256, and the wrapper verifies the downloaded distribution checksum.

No physical Android/iOS device or Android emulator was available. Android instrumentation tests were compiled, not executed; native system dialogs and older device WebViews still need the manual checks in the [Android release guide](android-release.md).
