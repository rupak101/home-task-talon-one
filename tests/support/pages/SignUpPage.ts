import { BasePage } from "./BasePage";

export class SignUpPage extends BasePage {
  get signUpDialog() {
    return cy.findByRole("dialog", { name: "Sign up" });
  }

  get usernameInput() {
    return this.byId("sign-username");
  }

  get passwordInput() {
    return this.byId("sign-password");
  }

  get submitButton() {
    return this.signUpDialog.findByRole("button", { name: "Sign up" });
  }

  openSignUpDialog() {
    this.signUpLink.click();
    this.signUpDialog.should("be.visible");
  }

  userSignUp(username: string, password: string) {
    this.openSignUpDialog();
    this.type(this.usernameInput, username);
    this.typeSecret(this.passwordInput, password);
    this.submitButton.click();
  }
}

export const signUpPage = new SignUpPage();
