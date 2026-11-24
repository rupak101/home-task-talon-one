import { BasePage } from "./BasePage";

export class LoginPage extends BasePage {
  get loginDialog() {
    return cy.findByRole("dialog", { name: "Log in" });
  }

  // The labels point at ids that don't exist, so the fields have no accessible name.
  get usernameInput() {
    return this.byId("loginusername");
  }

  get passwordInput() {
    return this.byId("loginpassword");
  }

  get submitButton() {
    return this.loginDialog.findByRole("button", { name: "Log in" });
  }

  openLoginDialog() {
    this.loginLink.click();
    this.loginDialog.should("be.visible");
  }

  clickSubmitButton() {
    this.submitButton.click();
  }

  userLogin(username: string, password: string) {
    this.openLoginDialog();
    this.type(this.usernameInput, username);
    this.typeSecret(this.passwordInput, password);
    this.clickSubmitButton();
  }

  userLogout() {
    this.logoutLink.click();
  }

  verifyUserLoggedInAs(username: string) {
    this.welcomeLink.should("be.visible").and("have.text", `Welcome ${username}`);
    this.logoutLink.should("be.visible");
    this.loginLink.should("not.exist");
    cy.getCookie("tokenp_").should("exist");
  }

  verifyUserLoggedOut() {
    this.loginLink.should("be.visible");
    this.signUpLink.should("be.visible");
    this.logoutLink.should("not.exist");
  }
}

export const loginPage = new LoginPage();
