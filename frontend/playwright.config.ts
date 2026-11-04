import { defineConfig } from '@playwright/test';

// Point at another deployment (e.g. the Docker stack) with E2E_BASE_URL.
const baseURL = process.env.E2E_BASE_URL ?? 'http://localhost:5180';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: false,
  // Tests share the seeded demo user, so run them one at a time.
  workers: 1,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? 'github' : 'list',
  use: {
    baseURL,
    trace: 'retain-on-failure',
    reducedMotion: 'reduce',
    // Use the locally installed Chrome so no browser download is needed.
    channel: process.env.CI ? undefined : 'chrome',
  },
  webServer: process.env.E2E_BASE_URL
    ? undefined
    : {
        command: 'npm run dev --prefix ..',
        url: 'http://localhost:5180',
        reuseExistingServer: true,
        timeout: 60_000,
      },
});
