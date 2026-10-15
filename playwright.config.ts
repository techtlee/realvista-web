import { defineConfig, devices } from '@playwright/test'

/**
 * Browser tests for the configurator.
 *
 * `channel` defaults to the installed Google Chrome, because Playwright's own
 * browsers are not downloaded on every machine. Set PW_CHANNEL= (empty) to use
 * Playwright's bundled Chromium instead, e.g. in CI after `playwright install`.
 */
const channel = process.env.PW_CHANNEL ?? 'chrome'

export default defineConfig({
  testDir: 'tests/e2e',
  fullyParallel: true,
  reporter: [['list']],
  use: {
    baseURL: 'http://localhost:3004',
    ...(channel ? { channel } : {}),
  },
  projects: [{ name: 'desktop', use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 900 } } }],
  webServer: {
    command: 'pnpm dev',
    url: 'http://localhost:3004',
    reuseExistingServer: true,
    timeout: 120_000,
    // No backend: submissions are logged and succeed (development only).
    env: { LEAD_ENDPOINT: '' },
  },
})
