import { mkdirSync, readFileSync, existsSync } from 'fs';
import { join } from 'path';
import type { Account, User } from '../types';

/** Read and parse a JSON file from `src/data`. */
export function loadJson<T>(relativePath: string): T {
  const fullPath = join(__dirname, '..', 'data', relativePath);
  return JSON.parse(readFileSync(fullPath, 'utf-8')) as T;
}

/** Return all ZincBank test users keyed by logical name. */
export function getUsers(): Record<string, User> {
  return loadJson<Record<string, User>>('users.json');
}

/** Return a single user by logical key (e.g. 'standard'). */
export function getUser(key: string): User {
  const user = getUsers()[key];
  if (!user) {
    throw new Error(`Unknown test user '${key}'. Available keys: ${Object.keys(getUsers()).join(', ')}`);
  }
  return user;
}

/** Return all ZincBank test accounts as an array. */
export function getAccounts(): Account[] {
  return Object.values(loadJson<Record<string, Account>>('accounts.json'));
}

/** Generate a random 6-digit account number. */
export function generateAccountNumber(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

/** Format a numeric amount with two decimal places. */
export function formatCurrency(amount: number): string {
  return amount.toFixed(2);
}

/** Generate a random monetary amount within a range. */
export function randomAmount(min = 10, max = 500): number {
  return Math.round((Math.random() * (max - min) + min) * 100) / 100;
}

/** Ensure a directory exists (created recursively if needed). */
export function ensureDirSync(dir: string): void {
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }
}
