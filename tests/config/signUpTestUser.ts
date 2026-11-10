import { randomUUID } from "node:crypto";
import { API_PAYLOADS, type TestUser } from "../support/api/payloads";
import { API_ROUTES } from "../support/api/routes";

// Runs in Node from cypress.config.ts, so it uses fetch instead of cy.request.
// One user per run, so parallel runs never share a cart. demoblaze has no way to delete it afterwards.
async function signUpTestUser(apiUrl: string): Promise<TestUser> {
  const user = { username: `cy_${randomUUID().slice(0, 12)}`, password: randomUUID() };
  const response = await fetch(`${apiUrl}${API_ROUTES.signUp}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(API_PAYLOADS.signUp(user)),
  });
  const body = await response.text();
  if (!response.ok || body.includes("errorMessage")) {
    throw new Error(`Could not sign up the test user: ${response.status} ${body}`);
  }
  return user;
}

// Signs up the user and passes it to the tests, which read it with cy.env (see credentials.ts).
export async function addTestUser(config: Cypress.PluginConfigOptions, apiUrl: string) {
  const user = await signUpTestUser(apiUrl);
  config.env.TEST_USERNAME = user.username;
  config.env.TEST_PASSWORD = user.password;
}
