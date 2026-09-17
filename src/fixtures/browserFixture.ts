import { chromium, firefox, webkit } from '@playwright/test';
import type { Browser, BrowserContext, Page } from '@playwright/test';
import { env } from '../config/env';
import { browserLaunchOptions } from '../config/cucumber.config';

/**
 * Custom Playwright fixture that owns the browser lifecycle.
 *
 * The Cucumber hooks (`src/hooks/hooks.ts`) call these helpers to launch a
 * browser once per run and to create an isolated context + page per scenario.
 */
export class BrowserFixture {
  /** Launch a browser for the configured project. */
  static async launch(): Promise<Browser> {
    const options = browserLaunchOptions();
    switch (env.browser) {
      case 'firefox':
        return firefox.launch(options);
      case 'webkit':
        return webkit.launch(options);
      default:
        return chromium.launch(options);
    }
  }

  /** Create a fresh browser context for a scenario. */
  static async createContext(browser: Browser): Promise<BrowserContext> {
    return browser.newContext({
      baseURL: env.baseUrl,
      viewport: { width: 1280, height: 720 }
    });
  }

  /** Create a page with the configured default timeout applied. */
  static async createPage(context: BrowserContext): Promise<Page> {
    const page = await context.newPage();
    page.setDefaultTimeout(env.defaultTimeout);
    return page;
  }
}
