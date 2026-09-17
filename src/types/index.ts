import type { Browser, BrowserContext, Page } from '@playwright/test';

/** A ZincBank user credential record. */
export interface User {
  username: string;
  password: string;
  firstName: string;
  lastName: string;
}

/** A ZincBank bank account record. */
export interface Account {
  accountNumber: string;
  type: 'Checking' | 'Savings';
  balance: number;
  owner: string;
}

/** Details required to perform a fund transfer. */
export interface TransferDetails {
  fromAccount: string;
  toAccount: string;
  amount: number;
}

/** Playwright runtime objects attached to the Cucumber World. */
export interface WorldBindings {
  browser: Browser;
  context: BrowserContext;
  page: Page;
}
