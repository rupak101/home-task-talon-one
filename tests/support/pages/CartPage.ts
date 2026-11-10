import { API_ROUTES } from "../api/routes";
import { ORDER_MESSAGES } from "../constants/messages";
import { BasePage } from "./BasePage";

export type Product = { id: number; name: string; price: number };
type Customer = { name: string; country: string; city: string; card: string; month: string; year: string };

export class CartPage extends BasePage {
  static readonly PATH = "/cart.html";

  get rows() {
    return this.byId("tbodyid").findAllByRole("row");
  }

  get total() {
    return this.byId("totalp");
  }

  get placeOrderButton() {
    return cy.findByRole("button", { name: "Place Order" });
  }

  get orderDialog() {
    return cy.findByRole("dialog", { name: "Place order" });
  }

  get orderTotal() {
    return this.byId("totalm");
  }

  get purchaseButton() {
    return this.orderDialog.findByRole("button", { name: "Purchase" });
  }

  get confirmationOkButton() {
    return cy.findByRole("button", { name: "OK" });
  }

  // The confirmation has no id or role, so the library's class is the only hook.
  get confirmationDialog() {
    return this.confirmationOkButton.closest(".sweet-alert");
  }

  get confirmationTitle() {
    return this.confirmationDialog.findByRole("heading");
  }

  get confirmationDetails() {
    return this.confirmationDialog.findByRole("paragraph");
  }

  row(productName: string) {
    return cy.findByRole("row", { name: (rowName) => rowName.startsWith(`${productName} `) });
  }

  visitCartPage() {
    cy.intercept("POST", `**${API_ROUTES.viewCart}`).as("viewCart");
    cy.visit(CartPage.PATH);
    cy.wait("@viewCart");
  }

  removeProductFromCart(productName: string) {
    cy.intercept("POST", `**${API_ROUTES.viewCart}`).as("viewCart");
    this.row(productName).findByRole("link", { name: "Delete" }).click();
    cy.wait("@viewCart");
  }

  openPlaceOrderDialog() {
    this.placeOrderButton.click();
    this.orderDialog.should("be.visible");
  }

  fillOrderForm(customer: Customer) {
    this.type(this.byId("name"), customer.name);
    this.type(this.byId("country"), customer.country);
    this.type(this.byId("city"), customer.city);
    this.type(this.byId("card"), customer.card);
    this.type(this.byId("month"), customer.month);
    this.type(this.byId("year"), customer.year);
  }

  clickSubmitButton() {
    this.purchaseButton.click();
  }

  confirmPurchase() {
    // Clicks are ignored until the opening animation adds the "visible" class.
    this.confirmationDialog.should("have.class", "visible");
    this.confirmationOkButton.click();
  }

  verifyCartContains(products: Product[]) {
    this.rows.should("have.length", products.length);
    products.forEach(({ name, price }) => {
      this.row(name)
        .findByRole("cell", { name: String(price) })
        .should("be.visible");
    });
  }

  verifyCartTotal(amount: number) {
    this.total.should("have.text", String(amount));
  }

  verifyOrderTotal(amount: number) {
    this.orderTotal.should("have.text", `Total: ${amount}`);
  }

  verifyOrderConfirmation(amount: number, customer: Customer) {
    this.confirmationTitle.should("be.visible").and("have.text", ORDER_MESSAGES.thankYou);
    this.confirmationDetails.invoke("text").should("match", /^Id: \d+/);
    this.confirmationDetails
      .should("contain.text", `Amount: ${amount} USD`)
      .and("contain.text", `Card Number: ${customer.card}`)
      .and("contain.text", `Name: ${customer.name}`);
  }

  verifyOrderConfirmationDate(date: Date) {
    this.confirmationDetails.should(
      "contain.text",
      `Date: ${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`,
    );
  }

  // Passes at once, so call it only after something that shows the form was handled, such as an alert.
  verifyNoOrderConfirmation() {
    this.confirmationOkButton.should("not.exist");
  }
}

export const cartPage = new CartPage();
