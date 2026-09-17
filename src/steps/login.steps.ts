import { Given, Then, When } from '@cucumber/cucumber';
import { env } from '../config/env';
import type { ZincBankWorld } from '../support/world';

Given('I am on the ZincBank sign in page', async function (this: ZincBankWorld): Promise<void> {
  await this.loginPage.goto();
});

When('I sign in with the configured username and password', async function (this: ZincBankWorld): Promise<void> {
  await this.loginPage.signIn(env.username, env.password);
});

Then('I should be signed in and see my accounts', async function (this: ZincBankWorld): Promise<void> {
  await this.accountsPage.expectVisible();
});

Then('the accounts page should greet the configured username', async function (this: ZincBankWorld): Promise<void> {
  await this.accountsPage.expectSignedInAs(env.username);
});
