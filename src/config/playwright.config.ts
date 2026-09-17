import { defineConfig, devices } from '@playwright/test';
import { env } from './env';

/**
 * Playwright configuration.
 *
 * Note: Cucumber (@cucumber/cucumber) is the primary test runner for this
 * framework. This config is used for Playwright's own tooling (e.g. trace
 * viewer, codegen) and documents the browser matrix. The actual browser
 * lifecycle for Cucumber scenarios is managed in `src/hooks/hooks.ts`.
 */
export default defineConfig({
  testDir: '../features',
  timeout: env.defaultTimeout,
  retries: env.retryCount,
  fullyParallel: false,
  reporter: [
    ['list'],
    ['html', { outputFolder: '../reports/playwright-report', open: 'never' }]
  ],
  use: {
    baseURL: env.baseUrl,
    headless: !env.headed,
    screenshot: env.screenshotOnFailure ? 'only-on-failure' : 'off',
    trace: 'on-first-retry',
    video: 'retain-on-failure'
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } }
  ]
});
