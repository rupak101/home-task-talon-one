import { type TestUser, UserApi } from "./api/UserApi";
import { CART_MESSAGES } from "./constants/messages";
import { homePage } from "./pages/HomePage";
import type { Product } from "./pages/CartPage";
import { productPage } from "./pages/ProductPage";

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Cypress {
    interface Chainable {
      stubAlert(): Chainable<void>;
      userLoginViaApi(user: TestUser): Chainable<void>;
      addProductToCart(category: string, product: Product): Chainable<void>;
    }
  }
}

Cypress.Commands.add("stubAlert", () => {
  cy.on("window:alert", cy.stub().as("alert"));
});

// Logs in through the API and stores the token in the tokenp_ cookie, like the site does.
Cypress.Commands.add("userLoginViaApi", (user) => {
  cy.session(
    user.username,
    () => {
      UserApi.getSessionToken(user).then((token) => {
        cy.setCookie("tokenp_", token, { domain: new URL(Cypress.config("baseUrl") ?? "").hostname });
      });
    },
    {
      validate() {
        cy.getCookie("tokenp_")
          .should("exist")
          .its("value")
          .then((token) => UserApi.getUserByToken(token))
          .its("body.Item.username")
          .should("eq", user.username);
      },
    },
  );
});

Cypress.Commands.add("addProductToCart", (category, { name, price }) => {
  homePage.visitHomePage();
  homePage.selectCategory(category);
  homePage.openProductPage(name);
  productPage.verifyProductDetails(name, price);
  productPage.addProductToCart();
  productPage.verifyAlertMessage(CART_MESSAGES.productAdded);
});
