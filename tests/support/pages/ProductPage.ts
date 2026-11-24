import { API_ROUTES } from "../api/routes";
import { BasePage } from "./BasePage";

export class ProductPage extends BasePage {
  get name() {
    return cy.findByRole("heading", { level: 2 });
  }

  get price() {
    return cy.findByRole("heading", { level: 3 });
  }

  get addToCartLink() {
    return cy.findByRole("link", { name: "Add to cart" });
  }

  addProductToCart() {
    cy.intercept("POST", `**${API_ROUTES.addToCart}`).as("addToCart");
    this.resetAlerts();

    this.addToCartLink.click();

    cy.wait("@addToCart");
  }

  verifyProductDetails(name: string, price: number) {
    cy.location("pathname").should("eq", "/prod.html");
    this.name.should("have.text", name);
    this.price.should("contain.text", `$${price}`);
  }
}

export const productPage = new ProductPage();
