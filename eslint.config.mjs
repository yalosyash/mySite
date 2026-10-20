// @ts-check
import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import eslintConfigPrettier from "eslint-config-prettier";

export default tseslint.config(
  { ignores: ["node_modules", "playwright-report", "test-results"] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    languageOptions: {
      globals: { ...globals.node },
    },
    rules: {
      "@typescript-eslint/no-explicit-any": "error",
    },
  },
  {
    files: ["src/main/js/**/*.js"],
    languageOptions: {
      globals: { ...globals.browser },
    },
  },
  eslintConfigPrettier,
);
