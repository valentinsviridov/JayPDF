import { readdir, readFile, writeFile, mkdir, copyFile } from 'node:fs/promises';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const root = process.cwd();
const output = path.join(root, 'public/licenses');
await mkdir(output, { recursive: true });
for (const name of ['AGPL-3.0-only.txt', 'MIT-PDFLince.txt']) {
  await copyFile(path.join(root, 'LICENSES', name), path.join(output, name));
}
await copyFile(path.join(root, 'NOTICE'), path.join(output, 'NOTICE.txt'));

// Include installed package notices conservatively, including build dependencies.
// Keep actual copyright/license texts rather than substituting SPDX identifiers.
const sections = [];
async function visitModules(directory) {
  for (const entry of (await readdir(directory, { withFileTypes: true })).sort((a, b) => a.name.localeCompare(b.name))) {
    if (entry.name.startsWith('.')) continue;
    const location = path.join(directory, entry.name);
    if (entry.name.startsWith('@')) { await visitModules(location); continue; }
    let pkg;
    try { pkg = JSON.parse(await readFile(path.join(location, 'package.json'), 'utf8')); } catch { continue; }
    const files = await readdir(location);
    const notices = files.filter(name => /^(licen[sc]e|copying|notice|ofl)([._-]|$)/i.test(name));
    for (const name of notices.sort()) {
      try { sections.push(`${pkg.name} ${pkg.version} — ${name}\n${await readFile(path.join(location, name), 'utf8')}`); } catch { /* Some packages use license directories. */ }
    }
    if (files.includes('node_modules')) await visitModules(path.join(location, 'node_modules'));
  }
}
await visitModules(path.join(root, 'node_modules'));
for (const folder of ['cmaps', 'standard_fonts', 'wasm']) {
  for (const name of (await readdir(path.join(root, 'public', folder))).filter(name => name.startsWith('LICENSE')).sort()) {
    sections.push(`PDF.js ${folder}/${name}\n${await readFile(path.join(root, 'public', folder, name), 'utf8')}`);
  }
}
// Native Android dependencies carry Apache 2.0 licenses, plus Kotlin's notices.
sections.push(await readFile(path.join(root, 'android/THIRD_PARTY_NOTICES.txt'), 'utf8'));
await writeFile(path.join(output, 'third-party.txt'), `JayPDF third-party notices\nIncludes runtime and build dependencies.\n\n${sections.join('\n\n' + '='.repeat(80) + '\n\n')}`);
let revision = 'unavailable';
let dirty = true;
try {
  revision = execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
  dirty = Boolean(execFileSync('git', ['status', '--porcelain'], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim());
} catch { /* Source archives need not contain .git. */ }
const pkg = JSON.parse(await readFile('package.json', 'utf8'));
await writeFile('public/build-info.json', JSON.stringify({ version: pkg.version, revision, dirty, source: 'https://github.com/valentinsviridov/JayPDF', license: 'AGPL-3.0-only' }, null, 2) + '\n');
console.log(`Generated ${sections.length} third-party notices and build provenance.`);
