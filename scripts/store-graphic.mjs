import { chromium } from '@playwright/test';
import { pathToFileURL } from 'node:url';
import path from 'node:path';

const browser = await chromium.launch();
try {
  const page = await browser.newPage({ viewport: { width: 1024, height: 500 }, deviceScaleFactor: 1 });
  await page.goto(pathToFileURL(path.resolve('store/feature-graphic.html')).href);
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: 'store/feature-graphic.png', type: 'png' });
  console.log('Created store/feature-graphic.png (1024 × 500).');
} finally { await browser.close(); }
