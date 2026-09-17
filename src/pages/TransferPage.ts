import type { Page } from '@playwright/test';

/**
 * Page Object for the ZincBank transfer funds page.
 */
export class TransferPage {
  constructor(private readonly page: Page) {}

  get form() {
    return this.page.locator('#transfer-form');
  }

  get fromAccountSelect() {
    return this.page.locator('#fromAccount');
  }

  get toAccountSelect() {
    return this.page.locator('#toAccount');
  }

  get amountInput() {
    return this.page.locator('#amount');
  }

  get transferButton() {
    return this.page.locator('#transfer-btn');
  }
}
