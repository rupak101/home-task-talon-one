import { existsSync, readFileSync } from "node:fs";

// Runs in Node from cypress.config.ts. Pick the environment with TEST_ENV, e.g. TEST_ENV=test-demo npm test.
export const testEnv = process.env.TEST_ENV || "test-demo";

const environmentFile = `tests/config/environments/${testEnv}.json`;
if (!existsSync(environmentFile)) {
  throw new Error(`Unknown TEST_ENV "${testEnv}": ${environmentFile} does not exist.`);
}

export const environment: { baseUrl: string; apiUrl: string } = JSON.parse(readFileSync(environmentFile, "utf8"));
