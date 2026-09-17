import 'dotenv/config';

export type BrowserName = 'chromium' | 'firefox' | 'webkit';

export interface EnvConfig {
  baseUrl: string;
  browser: BrowserName;
  headed: boolean;
  defaultTimeout: number;
  screenshotOnFailure: boolean;
  retryCount: number;
  username: string;
  password: string;
  useMock: boolean;
  screenshotDir: string;
  reportDir: string;
}

function toBool(value: string | undefined, fallback: boolean): boolean {
  if (value === undefined || value === '') {
    return fallback;
  }
  return value.toLowerCase() === 'true';
}

function toInt(value: string | undefined, fallback: number): number {
  const parsed = Number.parseInt(value ?? '', 10);
  return Number.isNaN(parsed) ? fallback : parsed;
}

function toBrowser(value: string | undefined): BrowserName {
  if (value === 'firefox' || value === 'webkit') {
    return value;
  }
  return 'chromium';
}

/**
 * Centralized, typed access to environment configuration.
 * Values are read from `.env` (via dotenv) with safe defaults.
 */
export const env: EnvConfig = {
  baseUrl: process.env.BASE_URL ?? 'http://localhost:3000',
  browser: toBrowser(process.env.BROWSER),
  headed: toBool(process.env.HEADED, false),
  defaultTimeout: toInt(process.env.DEFAULT_TIMEOUT, 15000),
  screenshotOnFailure: toBool(process.env.SCREENSHOT_ON_FAILURE, true),
  retryCount: toInt(process.env.RETRY_COUNT, 0),
  username: process.env.USERNAME ?? process.env.ZINC_USERNAME ?? 'standard_user',
  password: process.env.PASSWORD ?? process.env.ZINC_PASSWORD ?? 'secret_sauce',
  useMock: toBool(process.env.USE_MOCK, true),
  screenshotDir: process.env.SCREENSHOT_DIR ?? 'screenshots',
  reportDir: process.env.REPORT_DIR ?? 'reports'
};
