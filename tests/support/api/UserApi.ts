import { API_PAYLOADS, type TestUser } from "./payloads";
import { API_ROUTES, apiUrl } from "./routes";

export type { TestUser };

export const UserApi = {
  // log: false keeps the password out of the report.
  userLogin(user: TestUser) {
    return cy.request({
      method: "POST",
      url: apiUrl(API_ROUTES.login),
      body: API_PAYLOADS.login(user),
      log: false,
    });
  },

  getSessionToken(user: TestUser): Cypress.Chainable<string> {
    return UserApi.userLogin(user).its("body").invoke("replace", "Auth_token: ", "");
  },

  getUserByToken(token: string) {
    return cy.request("POST", apiUrl(API_ROUTES.check), API_PAYLOADS.check(token));
  },
};
