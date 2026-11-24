import "allure-cypress";
import "@testing-library/cypress/add-commands";
import { register as registerCypressGrep } from "@cypress/grep";
import "./commands";

registerCypressGrep();

beforeEach(() => {
  cy.stubAlert();
});
