import { API_PAYLOADS } from "./payloads";
import { API_ROUTES, apiUrl } from "./routes";

export type CartItem = { id: string; cookie: string; prod_id: number };

export const CartApi = {
  // Reads the cart with the token, then deletes each item by id, like the cart page's Delete link.
  // /deleteitem takes only the item id, no token. /deletecart is not used, as it only works because of bug 2.
  clearCart(token: string) {
    CartApi.viewCart(token)
      .its("body.Items")
      .each((item: CartItem) => {
        cy.request("POST", apiUrl(API_ROUTES.deleteItem), API_PAYLOADS.deleteItem(item.id));
      });
    CartApi.viewCart(token).its("body.Items").should("have.length", 0);
  },

  // Bug 2 in the README: empties the cart with just the username.
  deleteCartByUsername(username: string) {
    return cy.request("POST", apiUrl(API_ROUTES.deleteCart), API_PAYLOADS.deleteCart(username));
  },

  addProductToCart(token: string, productId: number) {
    return cy.request("POST", apiUrl(API_ROUTES.addToCart), API_PAYLOADS.addToCart(token, productId));
  },

  viewCart(token: string) {
    return cy.request<{ Items: CartItem[] }>("POST", apiUrl(API_ROUTES.viewCart), API_PAYLOADS.viewCart(token));
  },

  // Cart of the user logged in in the browser.
  getCartItems(): Cypress.Chainable<CartItem[]> {
    return cy
      .getCookie("tokenp_")
      .should("exist")
      .its("value")
      .then((token) => CartApi.viewCart(token).its("body.Items"));
  },
};
