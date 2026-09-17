import { After, AfterAll, Before, BeforeAll, Status } from '@cucumber/cucumber';
import type { ITestCaseHookParameter } from '@cucumber/cucumber';
import type { Browser } from '@playwright/test';
import { env } from '../config/env';
import { BrowserFixture } from '../fixtures/browserFixture';
import { mockZincBankRoutes } from '../support/mockZincBank';
import { ensureDirSync } from '../support/helpers';
import type { ZincBankWorld } from '../support/world';

let browser: Browser;

BeforeAll(async function (): Promise<void> {
  browser = await BrowserFixture.launch();
});

Before(async function (this: ZincBankWorld): Promise<void> {
  this.browser = browser;
  this.context = await BrowserFixture.createContext(browser);
  this.page = await BrowserFixture.createPage(this.context);

  if (env.useMock) {
    await mockZincBankRoutes(this.page, env.baseUrl);
  }
});

After(async function (this: ZincBankWorld, scenario: ITestCaseHookParameter): Promise<void> {
  if (env.screenshotOnFailure && scenario.result?.status === Status.FAILED) {
    ensureDirSync(env.screenshotDir);
    const safeName = (scenario.pickle.name || 'scenario').replace(/[^a-zA-Z0-9_-]+/g, '_');
    const timestamp = Date.now();
    await this.page.screenshot({
      path: `${env.screenshotDir}/${safeName}-${timestamp}.png`,
      fullPage: true
    });
  }

  await this.page?.close().catch(() => undefined);
  await this.context?.close().catch(() => undefined);
});

AfterAll(async function (): Promise<void> {
  await browser?.close().catch(() => undefined);
});
