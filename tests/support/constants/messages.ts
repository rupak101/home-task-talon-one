export const LOGIN_MESSAGES = {
  wrongPassword: "Wrong password.",
  userNotFound: "User does not exist.",
  missingFields: "Please fill out Username and Password.",
} as const;

export const SIGNUP_MESSAGES = {
  // The site's own wording.
  userExists: "This user already exist.",
} as const;

export const API_MESSAGES = {
  malformedToken: "Bad parameter, token malformed.",
} as const;

export const CART_MESSAGES = {
  // Guests get "Product added" without the dot.
  productAdded: "Product added.",
} as const;

export const ORDER_MESSAGES = {
  missingFields: "Please fill out Name and Creditcard.",
  thankYou: "Thank you for your purchase!",
} as const;
