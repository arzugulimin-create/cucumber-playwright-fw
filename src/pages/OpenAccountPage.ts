import type { Page } from '@playwright/test';

/**
 * Page Object for the ZincBank open-account page.
 */
export class OpenAccountPage {
  constructor(private readonly page: Page) {}

  get form() {
    return this.page.locator('#open-account-form');
  }

  get firstNameInput() {
    return this.page.locator('#firstName');
  }

  get lastNameInput() {
    return this.page.locator('#lastName');
  }

  get accountTypeSelect() {
    return this.page.locator('#accountType');
  }

  get openAccountButton() {
    return this.page.locator('#open-account-btn');
  }
}
