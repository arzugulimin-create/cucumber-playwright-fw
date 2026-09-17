import type { LaunchOptions } from '@playwright/test';
import { env } from './env';

/**
 * Type-safe Cucumber world parameters — mirrored in `cucumber.js`.
 * These values are injected into `this.parameters` for every scenario.
 */
export interface CucumberWorldParameters {
  baseUrl: string;
  browser: string;
  headed: boolean;
  defaultTimeout: number;
  useMock: boolean;
}

export const worldParameters: CucumberWorldParameters = {
  baseUrl: env.baseUrl,
  browser: env.browser,
  headed: env.headed,
  defaultTimeout: env.defaultTimeout,
  useMock: env.useMock
};

/**
 * Playwright browser launch options derived from the environment.
 */
export function browserLaunchOptions(): LaunchOptions {
  return {
    headless: !env.headed,
    args: ['--no-sandbox']
  };
}
