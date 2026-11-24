type Element = Cypress.Chainable<JQuery<HTMLElement>>;

export abstract class BasePage {
  // Role queries skip hidden elements, so hidden links are checked with should("not.exist").
  get loginLink(): Element {
    return cy.findByRole("link", { name: "Log in" });
  }

  get signUpLink(): Element {
    return cy.findByRole("link", { name: "Sign up" });
  }

  get logoutLink(): Element {
    return cy.findByRole("link", { name: "Log out" });
  }

  get welcomeLink(): Element {
    return cy.findByRole("link", { name: /^Welcome/ });
  }

  protected byId(id: string): Element {
    return cy.get(`[id="${id}"]`);
  }

  protected type(element: Element, text: string) {
    element.clear().type(text);
  }

  protected typeSecret(element: Element, text: string) {
    element.clear().type(text, { log: false });
  }

  resetAlerts() {
    cy.get<sinon.SinonStub>("@alert").invoke("resetHistory");
  }

  verifyAlertShown() {
    cy.get("@alert").should("have.been.called");
  }

  verifyAlertMessage(message: string) {
    cy.get("@alert").its("lastCall.args.0").should("eq", message);
  }
}
