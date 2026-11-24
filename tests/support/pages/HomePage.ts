import { API_ROUTES } from "../api/routes";
import { BasePage } from "./BasePage";

export class HomePage extends BasePage {
  static readonly PATH = "/index.html";

  // Waits for the product list, so it can't land on top of a category picked right after (seen in Firefox in CI).
  visitHomePage() {
    cy.intercept("GET", `**${API_ROUTES.entries}`).as("entries");
    cy.visit(HomePage.PATH);
    cy.wait("@entries");
  }

  categoryLink(category: string) {
    return cy.findByRole("link", { name: category });
  }

  productLink(name: string) {
    return cy.findByRole("link", { name });
  }

  selectCategory(category: string) {
    cy.intercept("POST", `**${API_ROUTES.byCategory}`).as("byCategory");
    this.categoryLink(category).click();
    cy.wait("@byCategory");
  }

  openProductPage(name: string) {
    this.productLink(name).click();
  }

  verifyHomePageOpen() {
    cy.location("pathname").should("eq", HomePage.PATH);
  }
}

export const homePage = new HomePage();
