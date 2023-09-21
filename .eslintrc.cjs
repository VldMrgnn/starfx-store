// eslint-disable-next-line no-undef
module.exports = {
  env: {
    browser: true,
    node: true,
    es2021: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:@typescript-eslint/recommended",
  ],
  overrides: [],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 2021,
    sourceType: "module",
  },
  plugins: ["react", "@typescript-eslint"],
  rules: {
    "no-unsafe-finally": "warn",
    "react/prop-types": "warn",
    "prefer-const": "warn",
    "react/display-name": "off",
    "react-hooks/exhaustive-deps": "off",
    "react/no-unescaped-entities": "off",
    "no-unused-vars": [
      "warn",
      { vars: "all", args: "after-used", ignoreRestSiblings: false },
    ],
    "no-async-promise-executor": "off",
    "@typescript-eslint/explicit-module-boundary-types": "off", // Optional: Depending on your use case
    "@typescript-eslint/no-explicit-any": "off", // Optional: Depending on your use case
  },
  settings: {
    react: {
      version: "detect",
    },
  },
};
