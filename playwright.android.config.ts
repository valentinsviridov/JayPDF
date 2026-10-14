import { defineConfig, devices } from '@playwright/test';

// Runs the actual packaged static assets at Android's local origin, with its CSP.
// Native document messages are simulated; system picker/device behavior needs device tests.
export default defineConfig({
  testDir: './tests/android-web',
  workers: 1,
  timeout: 90_000,
  use: { ...devices['Pixel 7'], browserName: 'chromium', serviceWorkers: 'block' },
});
