# cucumber-playwright-fw

End-to-end **Behavior-Driven Development (BDD)** test automation framework built with **Cucumber (Gherkin) + Playwright + TypeScript**.

Tests are written in plain-language `.feature` files and wired to automation code through step definitions, a Page Object Model (POM), and Playwright for real browser control.

## Tech Stack

| Layer | Technology |
| --- | --- |
| Test runner | [@cucumber/cucumber](https://github.com/cucumber/cucumber-js) v10 |
| Browser automation | [Playwright](https://playwright.dev) (`@playwright/test`) |
| Language | TypeScript (strict) |
| Runtime | Node.js + `ts-node` |
| Config | `dotenv` + typed `src/config/env.ts` |

## Prerequisites

- [Node.js](https://nodejs.org) 18+ (project tested on Node 25)
- npm

## Installation

```bash
# 1. Install dependencies
npm install

# 2. Install Playwright browsers (Chromium, Firefox, WebKit)
npx playwright install

# 3. Create your local environment config
cp .env.example .env
```

## Project Structure

```
cucumber-playwright-fw/
├── features/                 # Gherkin .feature files (your test scenarios)
│   └── login.feature
├── src/
│   ├── config/               # env + cucumber + playwright config
│   │   ├── env.ts
│   │   ├── cucumber.config.ts
│   │   └── playwright.config.ts
│   ├── data/                 # JSON test data (users, accounts)
│   │   ├── users.json
│   │   └── accounts.json
│   ├── fixtures/             # browser lifecycle helpers
│   │   └── browserFixture.ts
│   ├── hooks/                # Cucumber Before/After/All hooks
│   │   └── hooks.ts
│   ├── pages/                # Page Object Model (POM)
│   │   ├── LoginPage.ts
│   │   ├── AccountsPage.ts
│   │   ├── OpenAccountPage.ts
│   │   └── TransferPage.ts
│   ├── steps/                # Step definitions
│   │   └── login.steps.ts
│   ├── support/              # world, helpers, in-browser mock
│   │   ├── world.ts
│   │   ├── helpers.ts
│   │   └── mockZincBank.ts
│   └── types/                # shared TypeScript types
│       └── index.ts
├── reports/                  # generated test reports (gitignored)
├── screenshots/              # failure screenshots (gitignored)
├── cucumber.js               # Cucumber runner configuration
├── tsconfig.json
└── package.json
```

## Configuration (`.env`)

| Variable | Default | Description |
| --- | --- | --- |
| `BASE_URL` | `http://localhost:3000` | Application under test |
| `BROWSER` | `chromium` | `chromium` \| `firefox` \| `webkit` |
| `HEADED` | `false` | Run browser in headed mode |
| `DEFAULT_TIMEOUT` | `15000` | Global step timeout (ms) |
| `SCREENSHOT_ON_FAILURE` | `true` | Capture a screenshot on failure |
| `RETRY_COUNT` | `0` | Retries for flaky scenarios |
| `USE_MOCK` | `true` | Use the in-browser mock instead of a real backend |
| `USERNAME` / `ZINC_USERNAME` | — | Login username (used by the login test) |
| `PASSWORD` / `ZINC_PASSWORD` | — | Login password (used by the login test) |

> Keep the credentials in `.env` in sync with `src/data/users.json`; otherwise the mock rejects the login with **"Invalid username or password"**.

## Writing Tests

### 1. Create a feature file

Add a `.feature` file under `features/`:

```gherkin
Feature: ZincBank Sign In
  As a ZincBank customer
  I want to sign in with my username and password
  So that I can access my accounts

  Background:
    Given I am on the ZincBank sign in page

  @smoke @login
  Scenario: Sign in with valid credentials
    When I sign in with the configured username and password
    Then I should be signed in and see my accounts
```

### 2. Implement step definitions

Add matching step definitions under `src/steps/`:

```ts
import { Given, Then, When } from '@cucumber/cucumber';
import { env } from '../config/env';
import type { ZincBankWorld } from '../support/world';

Given('I am on the ZincBank sign in page', async function (this: ZincBankWorld) {
  await this.loginPage.goto();
});

When('I sign in with the configured username and password', async function (this: ZincBankWorld) {
  await this.loginPage.signIn(env.username, env.password);
});

Then('I should be signed in and see my accounts', async function (this: ZincBankWorld) {
  await this.accountsPage.expectVisible();
});
```

### 3. Reuse the Page Object Model

Each page in `src/pages/` encapsulates locators and actions for a screen. Access them from any step via `this.<pageName>` (populated by the `World`). The `World` (`src/support/world.ts`) also exposes the raw Playwright `browser`, `context`, and `page` objects.

## Running Tests

| Command | Description |
| --- | --- |
| `npm test` | Run all feature files |
| `npm run test:login` | Run the login feature only |
| `npm run test:chrome` | Run on Chromium |
| `npm run test:firefox` | Run on Firefox |
| `npm run test:webkit` | Run on WebKit |
| `npm run test:headed` | Run with the browser visible |
| `npm run test:tags -- @smoke` | Run scenarios matching a tag |
| `npm run typecheck` | Type-check the TypeScript code |
| `npm run clean` | Remove `reports/` and `screenshots/` |
| `npm run generate:report` | Generate the HTML report |

## Reports

Cucumber writes reports to `reports/` on every run:

- `reports/cucumber-report.json` — machine-readable results
- `reports/cucumber-report.html` — human-readable HTML report

Failure screenshots are saved to `screenshots/`. Both folders are gitignored.

## Mock Backend

By default (`USE_MOCK=true`) the framework runs against an **in-browser mock** (`src/support/mockZincBank.ts`) that emulates the ZincBank application via Playwright route interception — no real backend required. To test against a real deployment, set `BASE_URL` to your environment and `USE_MOCK=false`.

## License

ISC
