import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import path from 'node:path';

const manifest = await readFile('android/app/src/main/AndroidManifest.xml', 'utf8');
assert.match(manifest, /android:allowBackup="false"/);
assert.match(manifest, /android:usesCleartextTraffic="false"/);
assert.match(manifest, /android:dataExtractionRules="@xml\/data_extraction_rules"/);
assert.equal([...manifest.matchAll(/<uses-permission\b[^>]*>/g)].filter(([tag]) => !tag.includes('tools:node="remove"')).length, 0, 'The app must not request permissions.');

const gradle = await readFile('android/app/build.gradle', 'utf8');
assert.match(gradle, /targetSdk 36/);
assert.match(gradle, /verifyReleaseSigning/);
const root = 'android/app/src/main/assets/web';
async function files(directory) {
  const result = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const location = path.join(directory, entry.name);
    if (entry.isDirectory()) result.push(...await files(location)); else result.push(location);
  }
  return result;
}
const assets = await files(root);
assert(!assets.some(file => /\.(ts|tsx)$/.test(file)), 'Uncompiled TypeScript in the export. Build with Webpack so PDF workers are bundled.');
assert(!assets.includes(`${root}/sw.js`), 'Native app must not ship its website service worker.');
for (const file of ['index.html', 'privacy/index.html', 'licenses/index.html', 'pdf.worker.min.js', 'wasm/openjpeg.wasm', 'licenses/AGPL-3.0-only.txt', 'licenses/third-party.txt']) {
  assert(assets.includes(`${root}/${file}`), `Missing offline asset: ${file}`);
}
for (const file of assets.filter(file => file.endsWith('.html'))) {
  const html = await readFile(file, 'utf8');
  assert(!/<(?:script|img|iframe|source)\b[^>]*\bsrc=["']https?:\/\//i.test(html), `Remote runtime asset in ${file}`);
}
// Audit the APK, not only the source manifest: transitive dependencies can add permissions.
const apk = process.argv[2];
if (apk) {
  const sdk = process.env.ANDROID_HOME || process.env.ANDROID_SDK_ROOT;
  assert(sdk, 'Set ANDROID_HOME to audit the built APK.');
  const versions = (await readdir(path.join(sdk, 'build-tools'))).sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
  const aapt = path.join(sdk, 'build-tools', versions.at(-1), process.platform === 'win32' ? 'aapt.exe' : 'aapt');
  const permissions = execFileSync(aapt, ['dump', 'permissions', apk], { encoding: 'utf8' });
  const packageName = permissions.match(/^package: (.+)$/m)?.[1];
  // AndroidX Core adds this app-owned signature permission to protect internal receivers.
  // It grants no access to Android's network, documents, sensors, or personal information.
  const requested = [...permissions.matchAll(/^uses-permission: name='([^']+)'/gm)].map(match => match[1]);
  assert(requested.every(name => name === `${packageName}.DYNAMIC_RECEIVER_NOT_EXPORTED_PERMISSION`), `APK requests unexpected permissions:\n${permissions}`);
  const badging = execFileSync(aapt, ['dump', 'badging', apk], { encoding: 'utf8' });
  assert.match(badging, /targetSdkVersion:'36'/);
  const entries = execFileSync('unzip', ['-Z1', apk], { encoding: 'utf8' });
  assert(!/^lib\/.*\.so$/m.test(entries), 'Native libraries need an additional 16 KB page-size audit.');
  console.log('Built APK: no Android system permissions, API 36, no native .so libraries (only AndroidX internal signature permission).');
}
console.log(`Android privacy/package checks passed (${assets.length} bundled files).`);
