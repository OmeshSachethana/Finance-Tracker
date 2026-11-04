import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: false,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? 'github' : 'list',
  use: {
    baseURL: 'http://localhost:5180',
    trace: 'retain-on-failure',
    reducedMotion: 'reduce',
    // Use the locally installed Chrome so no browser download is needed.
    channel: process.env.CI ? undefined : 'chrome',
  },
  webServer: {
    command: 'npm run dev --prefix ..',
    url: 'http://localhost:5180',
    reuseExistingServer: true,
    timeout: 60_000,
  },
});
