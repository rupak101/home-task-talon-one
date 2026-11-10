import { homePage } from "../support/pages/HomePage";
import { loginPage } from "../support/pages/LoginPage";
import { cartPage } from "../support/pages/CartPage";
import { signUpPage } from "../support/pages/SignUpPage";
import { useTestUser } from "../support/credentials";
import { LOGIN_MESSAGES, SIGNUP_MESSAGES } from "../support/constants/messages";
import { TAGS } from "../support/constants/tags";
import testData from "../test-data/testData.json";

describe("Verify login and sign-up features", { tags: [TAGS.login, TAGS.regression] }, () => {
  const user = useTestUser();

  beforeEach(() => {
    homePage.visitHomePage();
    loginPage.verifyUserLoggedOut();
  });

  it("Verify user can log in with valid credentials", { tags: TAGS.smoke }, () => {
    loginPage.userLogin(user.username, user.password);
    loginPage.verifyUserLoggedInAs(user.username);
  });

  it("Verify user stays logged in on another page", () => {
    loginPage.userLogin(user.username, user.password);
    loginPage.verifyUserLoggedInAs(user.username);
    cartPage.visitCartPage();

    loginPage.verifyUserLoggedInAs(user.username);
  });

  it("Verify user can log out", { tags: TAGS.smoke }, () => {
    loginPage.userLogin(user.username, user.password);
    loginPage.verifyUserLoggedInAs(user.username);
    loginPage.userLogout();

    loginPage.verifyUserLoggedOut();
  });

  it("Verify login is rejected with a wrong password", () => {
    loginPage.userLogin(user.username, testData.wrongPassword);

    loginPage.verifyAlertMessage(LOGIN_MESSAGES.wrongPassword);
    loginPage.loginDialog.should("be.visible");
    loginPage.verifyUserLoggedOut();
  });

  it("Verify login is rejected for a username that does not exist", () => {
    loginPage.userLogin(`no_such_user_${Date.now()}`, testData.wrongPassword);

    loginPage.verifyAlertMessage(LOGIN_MESSAGES.userNotFound);
    loginPage.verifyUserLoggedOut();
  });

  it("Verify both fields are required when the login form is empty", () => {
    loginPage.openLoginDialog();
    loginPage.clickSubmitButton();

    loginPage.verifyAlertMessage(LOGIN_MESSAGES.missingFields);
    loginPage.verifyUserLoggedOut();
  });

  it("Verify sign-up is rejected for a username that already exists", () => {
    signUpPage.userSignUp(user.username, user.password);

    signUpPage.verifyAlertMessage(SIGNUP_MESSAGES.userExists);
    signUpPage.signUpDialog.should("be.visible");
    loginPage.verifyUserLoggedOut();
  });
});
