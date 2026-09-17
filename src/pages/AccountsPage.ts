import { expect, type Page } from '@playwright/test';

/**
 * Page Object for the ZincBank accounts (summary) page.
 */
export class AccountsPage {
  constructor(private readonly page: Page) {}

  get accountSummary() {
    return this.page.locator('#account-summary');
  }

  get accountsTable() {
    return this.page.locator('#accounts-table');
  }

  /** Assert that the accounts page is displayed. */
  async expectVisible(): Promise<void> {
    await this.accountSummary.waitFor({ state: 'visible' });
  }

  /** Assert that the page greets the given username. */
  async expectSignedInAs(username: string): Promise<void> {
    await expect(this.page.locator('p.muted')).toHaveText(`Signed in as ${username}`);
  }
}
