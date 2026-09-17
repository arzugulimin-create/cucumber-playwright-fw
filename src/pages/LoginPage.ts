import { expect, type Page } from '@playwright/test';
import { env } from '../config/env';

/**
 * Page Object for the ZincBank sign-in page.
 */
export class LoginPage {
  constructor(private readonly page: Page) {}

  get usernameInput() {
    return this.page.locator('#username');
  }

  get passwordInput() {
    return this.page.locator('#password');
  }

  get signInButton() {
    return this.page.locator('#signin-btn');
  }

  get errorAlert() {
    return this.page.locator('.alert-error');
  }

  /** Navigate to the sign-in page. */
  async goto(): Promise<void> {
    await this.page.goto(env.baseUrl);
  }

  /** Fill the credential fields and submit the sign-in form. */
  async signIn(username: string, password: string): Promise<void> {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.signInButton.click();
  }

  /** Assert that the given error message is displayed. */
  async expectError(message: string): Promise<void> {
    await expect(this.errorAlert).toHaveText(message);
  }
}
