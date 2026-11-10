import * as allure from "allure-js-commons";
import { homePage } from "../support/pages/HomePage";
import { cartPage } from "../support/pages/CartPage";
import { loginPage } from "../support/pages/LoginPage";
import { CartApi } from "../support/api/CartApi";
import { UserApi } from "../support/api/UserApi";
import { useTestUser } from "../support/credentials";
import { ORDER_MESSAGES } from "../support/constants/messages";
import { TAGS } from "../support/constants/tags";
import testData from "../test-data/testData.json";

const category = testData.categories.laptops;
const laptop = testData.laptops.sonyVaioI5;
const secondLaptop = testData.laptops.macBookPro;

describe("Verify the laptop purchase flow", { tags: [TAGS.purchase, TAGS.regression] }, () => {
  const user = useTestUser();

  beforeEach(() => {
    UserApi.getSessionToken(user).then(CartApi.clearCart);
  });

  it("Verify user can log in and buy a laptop through the UI", { tags: TAGS.smoke }, () => {
    allure.step("Log in", () => {
      homePage.visitHomePage();
      loginPage.userLogin(user.username, user.password);
      loginPage.verifyUserLoggedInAs(user.username);
    });

    allure.step("Add the laptop to the cart", () => {
      cy.addProductToCart(category, laptop);
    });

    allure.step("Check the cart", () => {
      cartPage.visitCartPage();
      cartPage.verifyCartContains([laptop]);
      cartPage.verifyCartTotal(laptop.price);
    });

    allure.step("Place the order", () => {
      cartPage.openPlaceOrderDialog();
      cartPage.verifyOrderTotal(laptop.price);
      cartPage.fillOrderForm(testData.customer);
      cartPage.clickSubmitButton();
    });

    allure.step("Check the confirmation and the emptied cart", () => {
      cartPage.verifyOrderConfirmation(laptop.price, testData.customer);
      cartPage.confirmPurchase();
      homePage.verifyHomePageOpen();
      CartApi.getCartItems().should("have.length", 0);
    });
  });

  describe("Logged in through the API", () => {
    beforeEach(() => {
      cy.userLoginViaApi(user);
    });

    it("Verify cart total adds up several laptops and updates when one is removed", () => {
      cy.addProductToCart(category, laptop);
      cy.addProductToCart(category, secondLaptop);
      cartPage.visitCartPage();

      cartPage.verifyCartContains([laptop, secondLaptop]);
      cartPage.verifyCartTotal(laptop.price + secondLaptop.price);

      cartPage.removeProductFromCart(secondLaptop.name);

      cartPage.verifyCartContains([laptop]);
      cartPage.verifyCartTotal(laptop.price);
      CartApi.getCartItems().should("have.length", 1);
    });

    it("Verify order is not placed without a name and credit card", () => {
      cy.addProductToCart(category, laptop);
      cartPage.visitCartPage();
      cartPage.openPlaceOrderDialog();
      cartPage.clickSubmitButton();

      cartPage.verifyAlertMessage(ORDER_MESSAGES.missingFields);
      cartPage.verifyNoOrderConfirmation();
      cartPage.orderDialog.should("be.visible");
      CartApi.getCartItems().should("have.length", 1);
    });

    // Bug 3 in the README: the month is off by one. Unskip once fixed.
    it.skip("Verify order confirmation shows today's date", () => {
      cy.addProductToCart(category, laptop);
      cartPage.visitCartPage();
      cartPage.openPlaceOrderDialog();
      cartPage.fillOrderForm(testData.customer);
      cartPage.clickSubmitButton();

      cartPage.verifyOrderConfirmationDate(new Date());
    });

    // Bug 4 in the README: no card or date checks. Unskip once fixed.
    // Assumes the fix shows an alert, like the missing-fields check.
    it.skip("Verify order is not placed with an invalid card number and expiry date", () => {
      cy.addProductToCart(category, laptop);
      cartPage.visitCartPage();
      cartPage.openPlaceOrderDialog();
      cartPage.fillOrderForm({ ...testData.customer, ...testData.invalidPayment });
      cartPage.resetAlerts();
      cartPage.clickSubmitButton();

      cartPage.verifyAlertShown();
      cartPage.orderDialog.should("be.visible");
      cartPage.verifyNoOrderConfirmation();
    });
  });
});
