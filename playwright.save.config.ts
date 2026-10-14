import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/save-compat',
  outputDir: 'test-results/save-compat',
  workers: 2,
  timeout: 60_000,
  use: { serviceWorkers: 'block', trace: 'retain-on-failure' },
  projects: [
    { name: 'save-picker', use: { ...devices['Desktop Chrome'], browserName: 'chromium' } },
    { name: 'android-fallback', use: { ...devices['Pixel 7'], browserName: 'chromium' } },
    { name: 'safari', use: { ...devices['Desktop Safari'], browserName: 'webkit' } },
    { name: 'iphone', use: { ...devices['iPhone 13'], browserName: 'webkit' } },
  ],
});
