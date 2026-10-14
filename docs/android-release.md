# Publishing JayPDF on Google Play

The Android app bundles the static Next.js export in a local WebView. It has no internet permission or backend dependency. Documents stay in memory while processing; exports use a private temporary cache and Android's Storage Access Framework. The existing website and Docker distribution continue to work.

## Build and install

Requirements: Bun, JDK 17 (Android Studio's compatible JDK also works), Android SDK platform 36, Build Tools 35.0.0, and platform-tools. The checked-in Gradle 8.14.5 wrapper verifies its distribution checksum. AGP is pinned to 8.13.2. Build-time internet access downloads dependencies; the installed app does not need it. Minimum Android version is 8.0 / API 26, with an updated Android System WebView or Chrome provider.

```sh
bun install --frozen-lockfile
# Set ANDROID_HOME to your SDK, or put sdk.dir=/absolute/path in android/local.properties.
bun run android:debug
adb install -r android/app/build/outputs/apk/debug/app-debug.apk
bun scripts/check-android.mjs android/app/build/outputs/apk/debug/app-debug.apk
```

Android Studio: run `bun run android:prepare`, then open `android/`. Repeat preparation after web changes. Debug has the separate ID `org.jaypdf.app.debug`. The production ID is `org.jaypdf.app`: confirm it before the first Play upload, because that ID cannot subsequently be changed for the same listing. `versionName` must match package.json; increment `versionCode` for every Play upload. Do not package a stale `assets/web` directory by bypassing preparation.

Production builds explicitly use Webpack: the current Turbopack build copied the application worker as raw TypeScript instead of compiling it. The packaging audit rejects raw TypeScript assets. `bun run android:test-web` runs the packaged files under Android's local origin and Content Security Policy in Chromium, checking real PDF/ZIP outputs with a simulated native export bridge. This complements, and does not replace, Android device tests.

## Sign the Play bundle

Create your own upload key outside the checkout. Keytool prompts for passwords, so they do not enter shell history. Keep encrypted backups of the key and credentials.

```sh
keytool -genkeypair -v -keystore /secure/location/jaypdf-upload.jks \
  -alias jaypdf-upload -keyalg RSA -keysize 3072 -validity 10000
cp android/release.properties.example android/release.properties
# Fill the four values in that ignored file, or set the same environment variables.
bun run android:bundle
```

Output: `android/app/build/outputs/bundle/release/app-release.aab`. Release builds fail without explicit signing credentials and never use the debug key. Enroll in [Play App Signing](https://developer.android.com/studio/publish/app-signing). The upload key authenticates your submissions; Google manages the app signing key. No billing library is needed for this upfront paid distribution: the purchase is configured in Play Console, outside the app.

The Android workflow builds an APK, instrumentation test APK, lint report and matching source archive. For an optional signed AAB, set repository secrets `JAYPDF_UPLOAD_KEYSTORE_BASE64`, `JAYPDF_KEYSTORE_PASSWORD`, `JAYPDF_KEY_ALIAS`, `JAYPDF_KEY_PASSWORD`, then manually run **Android build** with `signed_release` enabled. It uploads workflow artifacts only; it does not publish a release or submit to Google Play. Never expose signing secrets to pull-request workflows.

## Privacy and Play declarations

Deploy the website's generated `/privacy/` page so `https://jaypdf.org/privacy/` is public, accessible without login, and accurately identifies your actual publisher/contact before submission. The same page is bundled in-app and linked from every footer. The policy names the existing repository copyright holder, Valentin Sviridov, and `info@jaypdf.org`; update both policy and listing if the publisher changes. Verify you control the domain, mailbox and package namespace.

For this build, the expected [Data safety](https://support.google.com/googleplay/android-developer/answer/10787469) answer is **no user data collected or shared by the app**: no documents, device IDs, analytics or app-managed crash telemetry leave it. On-device processing is not off-device collection. Reassess the actual release and all dependencies before signing this declaration. Google Play purchase/order records, platform diagnostics, voluntarily sent support emails, and user-selected cloud document providers are described separately in the policy. The website's hosting traffic is also separate. Do not claim that Google or the selected provider processes no data.

- Ads: **No**. App access: all functionality accessible without credentials.
- No account creation: no account-deletion flow is needed for this implementation.
- No broad storage/media permission: use the system picker. Users choose a local folder for an offline workflow.
- App data backup and device transfer are disabled. Saved outputs remain in the user's chosen destination. Temporary exports are deleted after save/cancel/error/normal close and on the next launch after process death; clear app storage or uninstall to remove leftovers immediately.
- Complete the content rating, target audience, app category (suggested: Productivity), and any applicable declarations truthfully in Console. Do not infer audience selections from this document.

## Charge €1

Create a **paid** app and configure a merchant/payments profile, verified developer identity, support contact, and any required business/trader details in Play Console. Set the euro market price to **€1.00** where Console permits it and review local prices, taxes and currency conversion before release. The displayed price and your net proceeds are different; no price is hard-coded into the app.

Google permits paid-to-free conversion but generally does not permit converting an app that has been offered free back to paid under the same package ID. Choose paid before public release. Use test tracks to validate installation; see [Google's pricing instructions](https://support.google.com/googleplay/android-developer/answer/6334373).

## Store assets and listing

Copy the English listing and release notes from `store/en-US/`. The title is under 30 characters, the short description under 80 and the full description under 4,000. Do not put a price in artwork or descriptions, since market prices can differ.

- Store icon: `public/favicon-512x512.png` (512 × 512); verify its final appearance in Console.
- Feature graphic: generate the 1024 × 500 PNG with `bun scripts/store-graphic.mjs` after installing Playwright Chromium. Source layout: `store/feature-graphic.html`.
- Capture at least two real phone screenshots from the final APK. Use `adb exec-out screencap -p > store/phone-home.png`, navigate to another representative screen and capture `store/phone-workspace.png`. Use synthetic sample documents only. Review screenshots at phone and tablet sizes, and follow [Google's preview asset specifications](https://support.google.com/googleplay/android-developer/answer/9866151).

## License and source distribution

This setup retains the project's **AGPL-3.0-only** distribution. Charging for a copy is compatible with free software licensing; users retain their license rights, including redistribution. This does not make the Play app proprietary or change third-party rights. See [GNU's commercial distribution FAQ](https://www.gnu.org/licenses/gpl-faq.en.html#DoesTheGPLAllowMoney) and the repository's license files.

For **each published binary**, publish the matching complete source revision, lockfile, Android project and build instructions at no extra charge. From a clean committed tree, tag the release (for example `android-v1.0.0`) and attach the workflow's `jaypdf-source.zip` to that release. Make the source link available alongside the Play listing and in-app notices. Do this before distributing the binary. `build-info.json` records the source revision and whether the working tree was dirty. Do not ship a release with `dirty: true`, unpublished source, or version-mismatched notices. Keep dependency notices and the original PDFLince MIT attribution. Review rights to any added artwork or libraries; do not assume the commercial license covers third-party code.

## Required release validation

Run the repository checks and the Android build:

```sh
./scripts/verify-all.sh
bun run android:prepare
cd android
./gradlew assembleDebug assembleDebugAndroidTest lintDebug
# With an attached device/emulator:
./gradlew connectedDebugAndroidTest
# With production upload signing configured:
./gradlew bundleRelease lintRelease
```

Run the APK privacy audit from the repository root. Test the **signed release** through an internal Play track before production:

1. Fresh installation, airplane mode before first launch: every tool, locale, worker, PDF preview, privacy page and license must load. Test complex embedded fonts and PDF image codecs.
2. Open one/multiple PDFs and images with the Android picker; cancel and reopen. Exercise merge, compress, split, extract, rotate, reorder, crop, repair, and both image conversions.
3. Confirm that processing never opens a save picker automatically. Tap **Save as…** on each PDF, image or ZIP result, reopen the saved file in another app and verify contents. Test individual batch results, cancellation/retry, full storage, and a large document on a low-memory phone. Per-output Android export limit is 512 MB.
4. Test Android Back, keyboard, display cutouts, rotation, background/resume, process death, and tablet/multi-window layouts. Active documents are intentionally not restored after process death. Export-cache leftovers should disappear on next launch.
5. Check permission and network behavior on the built release; verify it cannot make network requests. Explicit external links should open a separate app. Check the final merged manifest and dependency changes.
6. Test on API 26 and a current API 36 device with current WebView. This APK packages no native `.so` libraries; PDF.js WASM runs inside the system WebView. If native dependencies are added later, audit [16 KB page-size support](https://developer.android.com/guide/practices/page-sizes).

Current target is API 36, matching [Google's August 31, 2026 requirement](https://developer.android.com/google/play/requirements/target-sdk); recheck requirements at release time. New personal developer accounts created after November 13, 2023 generally need at least 12 testers continuously opted into a closed test for 14 days and then production-access approval. Check [the requirements for your account](https://support.google.com/googleplay/android-developer/answer/14151465).

Repository preparation cannot complete your identity/payments verification, own your upload key, host the public policy, obtain real testing feedback, or guarantee Play approval. Those are the final publisher actions after the app is validated.
