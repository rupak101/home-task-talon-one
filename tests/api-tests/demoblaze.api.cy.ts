import { CartApi } from "../support/api/CartApi";
import { UserApi } from "../support/api/UserApi";
import { useTestUser } from "../support/credentials";
import { API_MESSAGES, LOGIN_MESSAGES } from "../support/constants/messages";
import { TAGS } from "../support/constants/tags";
import testData from "../test-data/testData.json";

const laptop = testData.laptops.sonyVaioI5;

describe("demoblaze API", { tags: [TAGS.api, TAGS.regression] }, () => {
  const user = useTestUser();

  describe("Login API: get a session token and reject invalid logins (/login)", () => {
    it("Verify a session token is returned for valid credentials", { tags: TAGS.smoke }, () => {
      UserApi.userLogin(user).should(({ status, body }) => {
        expect(status).to.eq(200);
        expect(body).to.match(/^Auth_token: \S+$/);
      });
    });

    it("Verify the returned token belongs to the user", () => {
      UserApi.getSessionToken(user).then((token) => {
        UserApi.getUserByToken(token).its("body.Item.username").should("eq", user.username);
      });
    });

    it("Verify login is rejected with a wrong password", () => {
      UserApi.userLogin({ ...user, password: testData.wrongPassword })
        .its("body")
        .should("deep.equal", { errorMessage: LOGIN_MESSAGES.wrongPassword });
    });

    it("Verify login is rejected for a username that does not exist", () => {
      UserApi.userLogin({ username: `no_such_user_${Date.now()}`, password: testData.wrongPassword })
        .its("body")
        .should("deep.equal", { errorMessage: LOGIN_MESSAGES.userNotFound });
    });

    // Bug 1 in the README: tokens can be forged. Unskip once fixed.
    // /check only accepts tokens of a live session, so the user logs in first.
    it.skip("Verify a logged-in user's token cannot be rebuilt from the username", () => {
      UserApi.getSessionToken(user).then(() => {
        // A real token is base64 of the username plus an expiry: the current time in units of 1,000,000 ms, plus 600.
        const expiry = Math.floor(Date.now() / 1_000_000) + 600;
        const forgedToken = btoa(`${user.username}${expiry}`);

        UserApi.getUserByToken(forgedToken).its("body").should("not.have.property", "Item");
      });
    });
  });

  describe("Cart API: add, view and clear the cart (/addtocart, /viewcart, /deletecart)", () => {
    beforeEach(() => {
      UserApi.getSessionToken(user).then(CartApi.clearCart);
    });

    it("Verify cart is empty once it is cleared", () => {
      UserApi.getSessionToken(user).then((token) => {
        CartApi.viewCart(token).its("body.Items").should("have.length", 0);
      });
    });

    it("Verify a product is added to the user's cart", () => {
      UserApi.getSessionToken(user).then((token) => {
        CartApi.addProductToCart(token, laptop.id).its("status").should("eq", 200);

        CartApi.viewCart(token)
          .its("body.Items")
          .should("have.length", 1)
          .its(0)
          .should("include", { prod_id: laptop.id, cookie: user.username });
      });
    });

    it("Verify a malformed token is rejected", () => {
      CartApi.viewCart("not-a-token").its("body").should("deep.equal", { errorMessage: API_MESSAGES.malformedToken });
    });

    // Bug 2 in the README: /deletecart needs no token. Unskip once fixed.
    it.skip("Verify cart is not emptied without a session token", () => {
      UserApi.getSessionToken(user).then((token) => {
        CartApi.addProductToCart(token, laptop.id);
        CartApi.deleteCartByUsername(user.username);

        CartApi.viewCart(token).its("body.Items").should("have.length", 1);
      });
    });
  });
});
