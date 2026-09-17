import type { Page } from '@playwright/test';
import { generateAccountNumber, getUser } from './helpers';

/** Canonical test users — the mock mirrors `src/data/users.json`. */
const STANDARD_USER = getUser('standard');
const LOCKED_USER = getUser('locked');

/** Escape text for safe inclusion in generated HTML. */
function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * In-browser mock of the ZincBank application.
 *
 * When `USE_MOCK=true` (default), these Playwright route handlers serve a
 * lightweight, self-contained version of the ZincBank UI so the framework
 * can run end-to-end without a real backend. Point `BASE_URL` at a real
 * deployment and set `USE_MOCK=false` to test against the actual app.
 */

const PAGE_CSS = `
* { box-sizing: border-box; }
body { font-family: 'Segoe UI', Arial, sans-serif; margin: 0; background: linear-gradient(135deg, #0b3d2e 0%, #145a3a 100%); min-height: 100vh; color: #1f2937; display: flex; justify-content: center; align-items: center; padding: 2rem; }
.card { background: #ffffff; border-radius: 12px; box-shadow: 0 10px 30px rgba(0,0,0,.25); padding: 2rem 2.5rem; width: 100%; max-width: 520px; }
h1 { color: #0b3d2e; margin-top: 0; font-size: 1.5rem; }
.brand { font-size: 1.8rem; letter-spacing: 1px; }
label { display: block; font-weight: 600; margin: .75rem 0 .25rem; font-size: .9rem; }
input, select { width: 100%; padding: .6rem .75rem; border: 1px solid #cbd5e1; border-radius: 6px; font-size: 1rem; }
button { margin-top: 1.25rem; width: 100%; padding: .75rem; background: #d4a017; border: none; border-radius: 6px; color: #fff; font-size: 1rem; font-weight: 700; cursor: pointer; }
button:hover { background: #b88a10; }
.alert-success { margin-top: 1rem; padding: .75rem 1rem; background: #d1fae5; color: #065f46; border: 1px solid #6ee7b7; border-radius: 6px; font-weight: 600; }
.alert-error { margin-top: 1rem; padding: .75rem 1rem; background: #fee2e2; color: #991b1b; border: 1px solid #fca5a5; border-radius: 6px; font-weight: 600; }
table { width: 100%; border-collapse: collapse; margin: 1rem 0; }
th, td { text-align: left; padding: .6rem .75rem; border-bottom: 1px solid #e2e8f0; }
th { background: #f1f5f9; color: #0b3d2e; }
.links { display: flex; gap: 1.25rem; margin-top: 1.25rem; }
.links a { color: #0b3d2e; font-weight: 600; text-decoration: none; }
.links a:hover { text-decoration: underline; }
.muted { color: #64748b; font-size: .85rem; }
a { color: #0b3d2e; }
`;

function layout(title: string, body: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${title}</title><style>${PAGE_CSS}</style></head>
<body>${body}</body>
</html>`;
}

function signInPage(error?: string): string {
  const alert = error
    ? `<div class="alert-error" role="alert">${escapeHtml(error)}</div>`
    : '';
  return layout(
    'ZincBank — Sign In',
    `<div class="card">
      <h1 class="brand">ZincBank</h1>
      <p class="muted">Sign in to your online banking</p>
      <form id="signin-form" method="get" action="/login">
        <label for="username">Username</label>
        <input type="text" id="username" name="username" autocomplete="username" required>
        <label for="password">Password</label>
        <input type="password" id="password" name="password" autocomplete="current-password" required>
        <button type="submit" id="signin-btn">Sign In</button>
      </form>
      ${alert}
    </div>`
  );
}

function accountsPage(username: string): string {
  return layout(
    'ZincBank — My Accounts',
    `<div id="account-summary">
      <div class="card">
        <h1 class="brand">ZincBank</h1>
        <p class="muted">Signed in as ${escapeHtml(username)}</p>
        <h1>My Accounts</h1>
        <table id="accounts-table">
          <thead><tr><th>Account #</th><th>Type</th><th>Balance</th></tr></thead>
          <tbody>
            <tr class="account-row" data-account-number="1001"><td>1001</td><td>Checking</td><td>$2,500.00</td></tr>
            <tr class="account-row" data-account-number="1002"><td>1002</td><td>Savings</td><td>$8,500.00</td></tr>
          </tbody>
        </table>
        <div class="links">
          <a id="open-account-link" href="/open-account">+ Open New Account</a>
          <a id="transfer-link" href="/transfer">⇄ Transfer Funds</a>
        </div>
      </div>
    </div>`
  );
}

function openAccountPage(): string {
  return layout(
    'ZincBank — Open Account',
    `<div class="card">
      <h1 class="brand">ZincBank</h1>
      <h1>Open a New Account</h1>
      <form id="open-account-form" method="get" action="/open-account">
        <label for="firstName">First name</label>
        <input type="text" id="firstName" name="firstName" required>
        <label for="lastName">Last name</label>
        <input type="text" id="lastName" name="lastName" required>
        <label for="accountType">Account type</label>
        <select id="accountType" name="accountType">
          <option value="Checking">Checking</option>
          <option value="Savings">Savings</option>
        </select>
        <button type="submit" id="open-account-btn">Open Account</button>
      </form>
    </div>`
  );
}

function openAccountSuccessPage(firstName: string, accountNumber: string): string {
  return layout(
    'ZincBank — Account Opened',
    `<div class="card">
      <h1 class="brand">ZincBank</h1>
      <div class="alert-success" role="status">Your account has been opened successfully</div>
      <p>Congratulations ${escapeHtml(firstName)}, your new account number is <strong id="account-number">${escapeHtml(accountNumber)}</strong>.</p>
      <a id="accounts-link" href="/accounts">Back to my accounts</a>
    </div>`
  );
}

function transferPage(): string {
  return layout(
    'ZincBank — Transfer Funds',
    `<div class="card">
      <h1 class="brand">ZincBank</h1>
      <h1>Transfer Funds</h1>
      <form id="transfer-form" method="get" action="/transfer">
        <label for="fromAccount">From account</label>
        <select id="fromAccount" name="fromAccount">
          <option value="1001">1001 — Checking ($2,500.00)</option>
          <option value="1002">1002 — Savings ($8,500.00)</option>
        </select>
        <label for="toAccount">To account</label>
        <select id="toAccount" name="toAccount">
          <option value="1002">1002 — Savings ($8,500.00)</option>
          <option value="1001">1001 — Checking ($2,500.00)</option>
        </select>
        <label for="amount">Amount</label>
        <input type="number" id="amount" name="amount" step="0.01" min="0.01" required>
        <button type="submit" id="transfer-btn">Transfer</button>
      </form>
    </div>`
  );
}

function transferSuccessPage(amount: string): string {
  return layout(
    'ZincBank — Transfer Complete',
    `<div class="card">
      <h1 class="brand">ZincBank</h1>
      <div class="alert-success" role="status">Transfer of $${escapeHtml(amount)} completed successfully</div>
      <a id="accounts-link" href="/accounts">Back to my accounts</a>
    </div>`
  );
}

/**
 * Register route handlers that emulate the ZincBank application.
 */
export async function mockZincBankRoutes(page: Page, baseUrl: string): Promise<void> {
  const origin = new URL(baseUrl).origin;

  await page.route(`${origin}/`, (route) =>
    route.fulfill({ status: 200, contentType: 'text/html', body: signInPage() })
  );

  await page.route(`${origin}/login*`, async (route) => {
    const params = new URL(route.request().url()).searchParams;
    const username = params.get('username') ?? '';
    const password = params.get('password') ?? '';

    if (username === LOCKED_USER.username) {
      await route.fulfill({
        status: 200,
        contentType: 'text/html',
        body: signInPage('This account has been locked. Contact support.')
      });
    } else if (password !== STANDARD_USER.password) {
      await route.fulfill({
        status: 200,
        contentType: 'text/html',
        body: signInPage('Invalid username or password.')
      });
    } else {
      await route.fulfill({
        status: 200,
        contentType: 'text/html',
        body: accountsPage(username)
      });
    }
  });

  await page.route(`${origin}/accounts*`, (route) =>
    route.fulfill({ status: 200, contentType: 'text/html', body: accountsPage(STANDARD_USER.username) })
  );

  await page.route(`${origin}/open-account*`, async (route) => {
    const url = new URL(route.request().url());
    const params = url.searchParams;
    const isSubmission = url.search.length > 0 && params.has('firstName');

    if (isSubmission) {
      const accountNumber = generateAccountNumber();
      const firstName = params.get('firstName') ?? 'Customer';
      await route.fulfill({
        status: 200,
        contentType: 'text/html',
        body: openAccountSuccessPage(firstName, accountNumber)
      });
    } else {
      await route.fulfill({ status: 200, contentType: 'text/html', body: openAccountPage() });
    }
  });

  await page.route(`${origin}/transfer*`, async (route) => {
    const url = new URL(route.request().url());
    const params = url.searchParams;
    const isSubmission = url.search.length > 0 && params.has('amount');

    if (isSubmission) {
      const amount = params.get('amount') ?? '0.00';
      await route.fulfill({
        status: 200,
        contentType: 'text/html',
        body: transferSuccessPage(amount)
      });
    } else {
      await route.fulfill({ status: 200, contentType: 'text/html', body: transferPage() });
    }
  });
}

