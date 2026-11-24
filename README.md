# Demoblaze Cypress Tests

[![Cypress tests](https://github.com/rupak101/home-task-talon-one/actions/workflows/cypress.yml/badge.svg)](https://github.com/rupak101/home-task-talon-one/actions/workflows/cypress.yml)

Automated tests for the **login** and **laptop purchase** flow of [demoblaze.com](https://www.demoblaze.com).

## Tools, frameworks and languages used

Cypress, TypeScript, Node.js, npm, Page Object Model (POM), Allure, ESLint, Prettier, Docker, GitHub Actions

## Development environment

Developed and run on macOS. It should work on other operating systems as well.

## Prerequisites

Install these if you don't have them yet. To check, run the command in a terminal: it prints a version if it is installed.

- [Git](https://git-scm.com/downloads): `git --version`
- [Node.js](https://nodejs.org) 22 or newer, npm comes with it: `node -v`
- [Docker Desktop](https://www.docker.com/products/docker-desktop/), only for running in a container: `docker --version`

No demoblaze account is needed: each test run signs up its own user.

## Getting started

1. In a terminal, run:

   ```bash
   git clone https://github.com/rupak101/home-task-talon-one.git
   cd home-task-talon-one
   npm ci                    # installs dependencies and Cypress, takes a few minutes
   ```

2. Run `npm test`. Expected result: **17 passing, 4 pending**. The 4 pending tests cover known bugs: they are skipped on purpose and fail if run (see [Bugs found](#bugs-found)).

## Run the tests

```bash
npm test                  # headless (no browser window)
npm run test:headed       # run tests in the browser window
npm run test:chrome       # run tests in Chrome (must be installed)
npm run cy:open           # Cypress app: click a test to run it
npm run test:smoke        # only the @smoke tests
npm run test:api          # only the API tests
```

## Run the tests in a Docker container

Docker Desktop must be running:

```bash
npm run test:docker
```

## Report

Opens an HTML report in the browser after a test run:

```bash
npm run allure:generate && npm run allure:open
```

## Code quality

```bash
npm run lint              # fixes lint and formatting issues
npm run format:check      # checks formatting
npm run lint:check        # checks lint
npm run typecheck         # checks types
```

## CI

[cypress.yml](.github/workflows/cypress.yml) runs lint, format and type checks, then the tests in Chrome and Firefox on
every push, pull request and night. Each browser job signs up its own user, so Chrome and Firefox run in parallel and no
secrets are needed.

## What is tested

- **Login** ([login.cy.ts](tests/e2e-tests/login.cy.ts)): valid login, staying logged in on another page, logout, wrong password, unknown user, empty form, sign up with a username that already exists.
- **Purchase** ([purchase.cy.ts](tests/e2e-tests/purchase.cy.ts)): buying a laptop end to end through the UI, cart total with two laptops and after removing one, order form validation.
- **API** ([demoblaze.api.cy.ts](tests/api-tests/demoblaze.api.cy.ts)): `/login`, `/addtocart`, `/viewcart`, `/deletecart`.

## Approach

With 3 days, I focused on the path every paying customer takes: the purchase, the login it depends on, the cart total and order form validation, plus the APIs behind them. Phones, monitors, the full sign-up flow and visual checks are left for later.

- **Page Object Model with stable locators** (ids, role and accessible name), so layout changes don't break tests.
- **Fixed expected data**, not read from the site, so a wrong price or name makes the test fail.
- **A fresh user per run**, so runs never share a cart and can run in parallel. Before each cart test the cart is emptied through `/deleteitem`, the same request as the cart page's Delete link. It takes only the item id, no token.
- **No fixed waits and no retries**: tests wait on requests and assertions, and a failed test is reported as failed.
- **API tests** next to the UI tests: fast backend checks that found the two security bugs below.

## Bugs found

1. **Session tokens can be forged**
   - Expected: a session token can't be guessed from public data.
   - Actual: the token is just base64 of the username and a time-based expiry, so anyone who knows the username of a logged-in user can rebuild their token without the password.
   - Skipped test: _Verify a logged-in user's token cannot be rebuilt from the username_.
2. **Anyone can empty anyone's cart**
   - Expected: `/deletecart` needs the user's session token.
   - Actual: it needs only the username, so anyone who knows a username can empty that user's cart.
   - Skipped test: _Verify cart is not emptied without a session token_.
3. **Wrong month on the order confirmation**
   - Expected: the confirmation shows today's date, e.g. `10/11/2026`.
   - Actual: it shows the previous month, e.g. `10/10/2026`, because `getMonth()` counts from 0.
   - Skipped test: _Verify order confirmation shows today's date_.
4. **The order form accepts any card and date**
   - Expected: an invalid card number or expiry date is rejected with an error.
   - Actual: card `abcd` with expiry `13/1999` is accepted and the order is placed.
   - Skipped test: _Verify order is not placed with an invalid card number and expiry date_.

## What I'd do next

- **The other categories** (phones, monitors) and the contact form.
- **Visual and accessibility checks** on the product and cart pages.
- **Claude Code skills**, so tests written with AI follow the same rules as this suite:
  - `/add-test`: explores a flow, then writes and runs a Cypress test with the page objects.
  - `/review-tests`: reviews specs for correctness and flakiness.
  - `/triage-failure`: says whether a failure is a site bug, a broken test or flakiness.
  - `hallucination-guardrails`: keeps tests to locators, texts and routes confirmed on the live site.

## AI usage and disclosure

I used Claude (Claude Code) as a reviewer after writing the tests:

- **Code review**: feedback on readability and code quality.
- **Clean-up**: based on that feedback I removed unused code and made the suggested changes.
- **Coverage review**: checked my test scenarios with AI to make sure the login and laptop purchase flows are fully covered.
