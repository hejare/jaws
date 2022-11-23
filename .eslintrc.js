module.exports = {
  "env": {
    "node": true,
    "browser": true,
    "es2021": true,
  },
  "extends": [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:@typescript-eslint/recommended",
  ],
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "project": "./tsconfig.lint.json",

    "ecmaFeatures": {
      "tsx": true,
    },
    "ecmaVersion": 12,
    "sourceType": "module",
  },
  "plugins": [
    "react",
    "@typescript-eslint",
    "prettier"
  ],
  "overrides": [
    {
      "files": ['*.ts', '*.tsx'],

      // As mentioned in the comments, you should extend TypeScript plugins here,
      // instead of extending them outside the `overrides`.
      // If you don't want to extend any rules, you don't need an `extends` attribute.
      "extends": [
        'plugin:@typescript-eslint/recommended',
        'plugin:@typescript-eslint/recommended-requiring-type-checking',
      ],

      "parserOptions": {
        "project": ['./tsconfig.json'], // Specify it only for TypeScript files
      },
      "rules": {
        "react/prop-types": 0,
        "no-unused-vars": "warn",
        "no-case-declarations": 0,
        "react/require-default-props": "off",
        "prefer-destructuring": "off",
        "prettier/prettier": "error",
        "react-hooks/exhaustive-deps": 0,
        "react/jsx-props-no-spreading": "off",
        "react/react-in-jsx-scope": "off",
        "no-param-reassign": [
          "error",
          {
            "props": false,
          },
        ],
        "space-before-function-paren": [
          "error",
          {
            "anonymous": "always",
            "named": "never",
            "asyncArrow": "always",
          },
        ],
        "object-curly-spacing": [
          "error",
          "always",
        ],
        // Make async code easier to maintain by highlighting common errors
        "@typescript-eslint/await-thenable": "error",
        "@typescript-eslint/no-floating-promises": "error",
        "@typescript-eslint/no-misused-promises": "error",
        "@typescript-eslint/promise-function-async": [
          "error",
          {
            "checkArrowFunctions": false,
          },
        ],
        "no-return-await": "off",
        "@typescript-eslint/return-await": "error",
        "no-shadow": "off",
        "@typescript-eslint/no-shadow": "warn",
        "@typescript-eslint/no-explicit-any": [
          "error",
          {
            "ignoreRestArgs": true,
          },
        ],
        "@typescript-eslint/require-array-sort-compare": [
          "error",
          {
            "ignoreStringArrays": true,
          },
        ],
        // New rules that should help enforce a consistent code style
        "@typescript-eslint/array-type": "error",
        "@typescript-eslint/brace-style": "error",
        "@typescript-eslint/comma-spacing": "error",
        "@typescript-eslint/explicit-member-accessibility": "error",
        "@typescript-eslint/lines-between-class-members": [
          "error",
          "always",
          {
            "exceptAfterOverload": true,
            "exceptAfterSingleLine": true,
          },
        ],
        "@typescript-eslint/member-delimiter-style": "error",
        "@typescript-eslint/member-ordering": [
          "error",
          {
            "default": [
              "static-field",
              "public-field",
              "protected-field",
              "private-field",
              "field",
              "constructor",
              "static-method",
              "public-method",
              "protected-method",
              "private-method",
              "method",
              "signature",
            ],
          },
        ],
        "@typescript-eslint/space-infix-ops": "error",
        "@typescript-eslint/type-annotation-spacing": "error",
        // Turn off conflicting rules
        "brace-style": "off",
        "comma-spacing": "off",
        "lines-between-class-members": "off",
        "space-infix-ops": "off",
        "react/display-name": "off",

        // TEMP: ENABLE THIS WHEN WE WANT TO GET BETTER TYPESCRIPT CODE:
        "@typescript-eslint/no-unsafe-assignment": "off",
        "@typescript-eslint/no-unsafe-argument": "off",
        "@typescript-eslint/no-unsafe-member-access": "off",
        "@typescript-eslint/no-unsafe-call": "off",
        "@typescript-eslint/no-unsafe-return": "off",
        "@typescript-eslint/no-explicit-any": "off",
        "@typescript-eslint/no-misused-promises": "warn"
      },

    },
  ],
};
