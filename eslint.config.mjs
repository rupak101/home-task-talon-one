import js from "@eslint/js";
import tseslint from "typescript-eslint";
import pluginCypress from "eslint-plugin-cypress";

export default tseslint.config(
  { ignores: ["node_modules/", "tests/reports/"] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ["tests/**/*.ts"],
    extends: [pluginCypress.configs.recommended],
    rules: {
      "cypress/no-unnecessary-waiting": "error",
    },
  },
);
