export const API_ROUTES = {
  addToCart: "/addtocart",
  byCategory: "/bycat",
  check: "/check",
  deleteCart: "/deletecart",
  deleteItem: "/deleteitem",
  entries: "/entries",
  login: "/login",
  signUp: "/signup",
  viewCart: "/viewcart",
} as const;

export const apiUrl = (route: string) => `${Cypress.expose("apiUrl")}${route}`;
