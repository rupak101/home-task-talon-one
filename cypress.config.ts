import { defineConfig } from "cypress";
import { plugin as cypressGrepPlugin } from "@cypress/grep/plugin";
import { allureCypress } from "allure-cypress/reporter";
import { environment, testEnv } from "./tests/config/environment";
import { addTestUser } from "./tests/config/signUpTestUser";

export default defineConfig({
  e2e: {
    baseUrl: environment.baseUrl,
    specPattern: ["tests/e2e-tests/**/*.cy.ts", "tests/api-tests/**/*.cy.ts"],
    supportFile: "tests/support/e2e.ts",
    fixturesFolder: false,
    screenshotsFolder: "tests/reports/screenshots",
    downloadsFolder: "tests/reports/downloads",
    viewportWidth: 1280,
    viewportHeight: 800,
    // demoblaze's API is slow
    defaultCommandTimeout: 10000,
    async setupNodeEvents(on, config) {
      cypressGrepPlugin(config);
      allureCypress(on, config, {
        resultsDir: "tests/reports/allure-results",
        environmentInfo: { TEST_ENV: testEnv, baseUrl: environment.baseUrl, browser: config.browser?.name ?? "" },
      });
      await addTestUser(config, environment.apiUrl);
      return config;
    },
  },
  expose: {
    apiUrl: environment.apiUrl,
    grepFilterSpecs: true,
    grepOmitFiltered: true,
  },
});
