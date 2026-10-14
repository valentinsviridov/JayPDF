import { cp, readFile, rm, stat } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const destination = path.join(root, 'android/app/src/main/assets/web');
for (const file of ['index.html', 'privacy/index.html', 'licenses/index.html', 'pdf.worker.min.js', 'wasm/openjpeg.wasm', 'licenses/third-party.txt']) {
  if (!(await stat(path.join(root, 'out', file))).isFile()) throw new Error(`Missing export: ${file}`);
}
const pkg = JSON.parse(await readFile('package.json', 'utf8'));
const gradle = await readFile('android/app/build.gradle', 'utf8');
if (!gradle.includes(`versionName '${pkg.version}'`)) throw new Error('Keep package.json version and Android versionName in sync.');
await rm(destination, { recursive: true, force: true });
await cp(path.join(root, 'out'), destination, { recursive: true });
await rm(path.join(destination, 'sw.js'), { force: true });
console.log('Bundled static app in android/app/src/main/assets/web. No server or network is needed at runtime.');
