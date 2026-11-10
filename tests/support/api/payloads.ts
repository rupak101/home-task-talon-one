export type TestUser = { username: string; password: string };

// The site sends the password base64-encoded.
const credentials = ({ username, password }: TestUser) => ({ username, password: btoa(password) });

export const API_PAYLOADS = {
  login: credentials,

  signUp: credentials,

  check: (token: string) => ({ token }),

  addToCart: (token: string, productId: number) => ({
    id: crypto.randomUUID(),
    cookie: token,
    prod_id: productId,
    flag: true,
  }),

  viewCart: (token: string) => ({ cookie: token, flag: true }),

  // Same call the site makes after an order: just the username, no token (bug 2 in the README).
  deleteCart: (username: string) => ({ cookie: username }),

  deleteItem: (itemId: string) => ({ id: itemId }),
};
