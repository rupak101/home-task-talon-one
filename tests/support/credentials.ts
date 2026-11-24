import type { TestUser } from "./api/UserApi";

// Call at the top of a describe. The values are empty until the before hook runs, so only read them inside tests.
// cypress.config.ts signs up the user and fails the run if that does not work.
export const useTestUser = (): TestUser => {
  const user: TestUser = { username: "", password: "" };
  before(() => {
    cy.env(["TEST_USERNAME", "TEST_PASSWORD"], { log: false }).then(({ TEST_USERNAME, TEST_PASSWORD }) => {
      Object.assign(user, { username: String(TEST_USERNAME), password: String(TEST_PASSWORD) });
    });
  });
  return user;
};
