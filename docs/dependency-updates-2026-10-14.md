# Dependency and security review — 2026-10-14

Updates use stable releases published by **2026-10-12 15:09:42 UTC**, at least 48 hours before this review began. Publication dates were checked against npm registry metadata. All 161 newly resolved npm versions, including transitive packages, passed this cutoff; the newest is `zod` 4.6.6, published 2026-10-11 16:18 UTC.

Before this review, `bun audit` reported **53 advisories** (35 high, 14 moderate, 4 low). After it, **2 advisories** remain (1 high, 1 moderate). Neither has a compatible fix; see [Remaining advisories](#remaining-advisories).

## Direct npm updates

| Package | Previous | Updated | Published (UTC) |
| --- | --- | --- | --- |
| `baseline-browser-mapping` | 2.11.25 | 2.11.28 | 2026-10-08 |
| `caniuse-lite` | 1.0.30001810 | 1.0.30001815 | 2026-10-07 |
| `lucide-react` | 1.47.0 | 1.55.0 | 2026-10-10 |
| `next` | 16.3.6 | 16.4.0 | 2026-10-06 |
| `pdfjs-dist` | 6.3.289 | 6.4.299 | 2026-10-03 |
| `zod` | 4.6.5 | 4.6.6 | 2026-10-11 |
| `@playwright/test` | 1.63.0 | 1.64.0 | 2026-10-07 |
| `@types/node` | 22.20.4 | 22.20.5 | 2026-10-01 |
| `@typescript-eslint/eslint-plugin` | 8.70.1 | 8.71.1 | 2026-10-05 |
| `@typescript-eslint/parser` | 8.70.1 | 8.71.1 | 2026-10-05 |
| `eslint-config-next` | 16.3.6 | 16.4.0 | 2026-10-06 |
| `postcss` | 8.5.28 | 8.5.29 | 2026-10-05 |
| `prettier` | 3.9.9 | 3.9.10 | 2026-10-10 |

13 direct npm packages were updated with `bun update`. No source changes were required.

## Security fixes

`next` 16.4.0 fixes six Next.js advisories that affect versions `>=16.0.0 <16.3.8`: [GHSA-cjq9-62q9-8jv4](https://github.com/advisories/GHSA-cjq9-62q9-8jv4) (high, Image Optimization SSRF), [GHSA-f87g-xv8r-7p7x](https://github.com/advisories/GHSA-f87g-xv8r-7p7x), [GHSA-mcj8-r9mp-w47p](https://github.com/advisories/GHSA-mcj8-r9mp-w47p), [GHSA-3w37-wq28-93x7](https://github.com/advisories/GHSA-3w37-wq28-93x7), [GHSA-4jqv-mc3x-m676](https://github.com/advisories/GHSA-4jqv-mc3x-m676) and [GHSA-39w2-rjm5-chcv](https://github.com/advisories/GHSA-39w2-rjm5-chcv). JayPDF is a static export served by nginx. It does not use the Image Optimization server, ISR, Draft Mode or `use cache` at runtime, so production exposure was limited. The dev-server MCP endpoint advisory affected local development only.

`bun update` kept existing locked transitive versions when they still satisfied their parents' ranges. As a result, vulnerable copies remained in the lockfile. `bun.lock` was regenerated from `package.json` under the `bunfig.toml` age gate. This moved transitive dependencies to the newest eligible versions that their parent ranges allow:

| Package | Locked before | Locked after | Advisories cleared |
| --- | --- | --- | --- |
| `sharp` (via `next`) | 0.35.4 | 0.35.5 | [GHSA-wq5f-xc86-pv6w](https://github.com/advisories/GHSA-wq5f-xc86-pv6w) (librsvg) |
| `fast-uri` | 3.1.5 | 3.1.8 | 6 SSRF / host-confusion advisories |
| `brace-expansion` | 1.1.11, 2.0.1, 5.0.9 | 1.1.21, 5.0.12 | 10 DoS / ReDoS advisories |
| `minimatch` | 3.1.2, 3.1.5, 9.0.5, 10.2.6 | 3.1.5, 10.2.6 | 3 ReDoS advisories |
| `picomatch` | 2.3.1, 4.0.2, 4.0.5 | 2.3.2, 4.0.7 | 2 advisories |
| `flatted` | 3.3.3 | 3.4.4 | 2 advisories (DoS, prototype pollution) |
| `glob` (via `sucrase`) | 10.4.5 | no longer in the tree | [GHSA-5j98-mcp5-4vw2](https://github.com/advisories/GHSA-5j98-mcp5-4vw2) |
| `yaml` (via `postcss-load-config`) | 2.7.1 | no longer in the tree | [GHSA-48c2-rrv3-qjmp](https://github.com/advisories/GHSA-48c2-rrv3-qjmp) |
| `js-yaml`, `nanoid`, `source-map-js` | 4.3.1, 3.3.17, 1.2.1 (nested copies) | 4.3.2, 3.3.20, 1.2.2 | 1 advisory each |

`serve` 14.2.6 is the latest release. It pins `compression` to exactly 1.8.1, which is affected by [GHSA-vc2v-76pw-4v95](https://github.com/advisories/GHSA-vc2v-76pw-4v95). A `package.json` override forces the patched 1.8.2 release, published 2026-09-11. Remove this override once `serve` depends on a fixed version.

## Remaining advisories

- **`braces` ≤ 3.0.3** — [GHSA-vfj7-8cjw-p6xm](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm), high. No patched version has been published. 3.0.3 is the latest release. `tailwindcss` and `@next/eslint-plugin-next` use it through `micromatch` to expand the project's own glob patterns at build or lint time. It is not shipped to the browser and does not process user input.
- **`postcss-selector-parser` < 7.1.6** — [GHSA-rj75-hqrm-r3gf](https://github.com/advisories/GHSA-rj75-hqrm-r3gf), moderate. The fix exists only in the 7.x major. Tailwind 3 requires `^6.1.x`, and `@tailwindcss/typography` pins exactly 6.0.10. The Tailwind 3 copies now resolve to 6.1.4, which clears the separate low-severity [GHSA-w9m9-85wc-3x92](https://github.com/advisories/GHSA-w9m9-85wc-3x92). The parser only handles the project's own CSS at build time. Forcing 7.x onto Tailwind 3 was not attempted because the parser API changed.

## Android updates

| Dependency | Previous | Updated | Published |
| --- | --- | --- | --- |
| Gradle wrapper | 8.14.5 | 8.14.6 | 2026-10-08 |
| WebKit | 1.17.0 | 1.17.1 | 2026-09-23 |

[Gradle 8.14.6](https://docs.gradle.org/8.14.6/release-notes.html) is a security release for the 8.x line. It fixes three high-rated vulnerabilities: unauthenticated deserialization on the worker-to-daemon channel, deserialization before authentication in client–daemon communication, and repositories not being disabled after SSL failures. The wrapper was regenerated by Gradle 8.14.6 itself. The distribution SHA-256 (`7988ed07…07bd24`) and wrapper JAR SHA-256 (`ad16bca4…37e0`) match Gradle's published values. `gradlew` and `gradlew.bat` are unchanged.

WebKit 1.17.1 was held back in the previous review because of the cutoff and is now eligible. Its AAR metadata requires compile SDK 33 or higher and AGP 7.2.0 or higher, so it works with the existing compile SDK 36 and AGP 8.13.2.

## Versions held back

- Newer `caniuse-lite` (1.0.30001816), `lucide-react` (1.57.0), `zod` (4.6.7), `@playwright/test` (1.64.1), `@typescript-eslint/*` (8.71.2) and `postcss` (8.5.30) were published after the cutoff. None of them is needed for an advisory fix.
- Tailwind 3.4.19, ESLint 9.39.5, TypeScript `~6.0.3`, and Node 22 types are kept for the reasons in the [September review](dependency-updates-2026-09-25.md#versions-held-back).
- Android Core 1.19.x still requires compile SDK 37 and AGP 9.1+. AGP 8.13.2 remains the latest stable 8.x release, so Core stays at 1.18.0. Activity 1.13.0 and the AndroidX Test libraries are already current.

## Validation

- Before verification, the cached Docker base images (`oven/bun:1`, now Bun 1.4.3; `node:22-bookworm`; `nginx:alpine`, now nginx 1.31.6) were re-pulled so both images use current OS patches.
- `./scripts/verify-all.sh` passed in Docker: lint, TypeScript checks, production web build (Next.js 16.4.0), 34 unit tests, 31 end-to-end tests, and 9 save-compatibility tests. Three picker-specific cases are intentionally skipped where the picker is unavailable. The production `jaypdf:local` image also built successfully.
- `bun audit` shows the two remaining advisories listed above, and the release-age audit of all 161 new lockfile entries found no violations.

No Android SDK was available in the review environment. The Android Gradle build (`assembleDebug assembleDebugAndroidTest lintDebug`) and APK audit were not run locally. The [Android CI workflow](../.github/workflows/android.yml) runs them on the next push or pull request.
