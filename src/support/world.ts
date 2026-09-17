import { IWorldOptions, World, setWorldConstructor } from '@cucumber/cucumber';
import type { Browser, BrowserContext, Page } from '@playwright/test';
import { env } from '../config/env';
import type { WorldBindings } from '../types';
import { AccountsPage } from '../pages/AccountsPage';
import { LoginPage } from '../pages/LoginPage';
import { OpenAccountPage } from '../pages/OpenAccountPage';
import { TransferPage } from '../pages/TransferPage';

/**
 * Custom Cucumber World carrying the Playwright runtime objects plus
 * convenient accessors for the Page Object Model.
 *
 * The `page`, `context` and `browser` fields are populated by the Before
 * hooks (see `src/hooks/hooks.ts`) before any step runs.
 */
export class ZincBankWorld extends World implements WorldBindings {
  public browser!: Browser;
  public context!: BrowserContext;
  public page!: Page;

  constructor(options: IWorldOptions) {
    super(options);
  }

  get baseUrl(): string {
    return env.baseUrl;
  }

  get loginPage(): LoginPage {
    return new LoginPage(this.page);
  }

  get accountsPage(): AccountsPage {
    return new AccountsPage(this.page);
  }

  get openAccountPage(): OpenAccountPage {
    return new OpenAccountPage(this.page);
  }

  get transferPage(): TransferPage {
    return new TransferPage(this.page);
  }
}

setWorldConstructor(ZincBankWorld);
