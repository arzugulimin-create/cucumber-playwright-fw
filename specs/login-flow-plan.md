# Plan: ZincBank Login Flow (BDD)

**Status:** Implemented & passing (`npm run test:login` → 1 scenario, 4 steps)
**Date:** 2026-09-17

## Objective
Implement a BDD (Gherkin + Playwright + Cucumber) login-flow test for ZincBank using `USERNAME`/`PASSWORD` env credentials, and fix credential-handling defects in the in-browser mock (`src/support/mockZincBank.ts`).

## Decisions
- Single source of truth for valid/blocked credentials: `src/data/users.json`.
- The mock validates logins against `users.json` (via `getUser()`).
- The test sends credentials from `.env` (`USERNAME` → `ZINC_USERNAME` → fallback; `PASSWORD` → `ZINC_PASSWORD` → fallback), resolved in `src/config/env.ts`.
- `.env` and `users.json` must stay in sync for the mock to accept the login.

## Credentials (current)
| Role | Username | Password |
| --- | --- | --- |
| standard (valid) | `student01@zinc.test` | `9pJolA7GBQec` |
| locked (blocked) | `locked_user` | `secret_sauce` |

## Work items
- [x] `src/support/mockZincBank.ts` — `escapeHtml()` for user-controlled values; credentials sourced from `users.json`
- [x] `src/config/env.ts` — `username`/`password` keys with fallbacks
- [x] `.env` / `.env.example` — credential keys synced to `users.json`
- [x] `src/pages/LoginPage.ts`, `src/pages/AccountsPage.ts` (+ minimal `OpenAccountPage.ts` / `TransferPage.ts` for `world.ts`)
- [x] `features/login.feature` (`@smoke @login`) + `src/steps/login.steps.ts`
- [x] `"test:login": "cucumber-js features/login.feature"` npm script
- [x] Validated: typecheck clean; test green with `student01@zinc.test` / `9pJolA7GBQec`

## How to run
- `npm run typecheck`
- `npm run test:login`

## Notes / gotchas
- Keep `.env` credentials in sync with `src/data/users.json`; otherwise the mock rejects the login with "Invalid username or password".
- This plan lives under `specs/` per user instruction; future file creations under `specs/` require explicit user approval (see `.clinerules/rules.md`).
