import js from "@eslint/js";
import tseslint from "@typescript-eslint/eslint-plugin";
import tsparser from "@typescript-eslint/parser";
import prettier from "eslint-config-prettier";
import prettierPlugin from "eslint-plugin-prettier";
import jest from "eslint-plugin-jest";

export default [
  js.configs.recommended,
  {
    ignores: ["node_modules", "dist", "build", "coverage", "config/*.js"],
  },
  {
    languageOptions: {
      parser: tsparser,
      parserOptions: {
        project: "./tsconfig.json",
        sourceType: "module",
      },
      globals: {
        process: "readonly",
        console: "readonly",
      },
    },
    plugins: {
      "@typescript-eslint": tseslint,
      prettier: prettierPlugin,
    },
    settings: {
      "import/resolver": {
        typescript: {
          project: "./tsconfig.json",
        },
        node: {
          extensions: [".ts", ".js"],
        },
      },
    },
    rules: {
      ...tseslint.configs.recommended.rules,
      ...tseslint.configs["recommended-requiring-type-checking"].rules,
      "@typescript-eslint/explicit-function-return-type": "warn",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_" },
      ],
      "@typescript-eslint/no-explicit-any": "error",
      "prettier/prettier": "error",
    },
  },
  {
    files: ["**/__tests__/**/*.spec.ts", "**/__tests__/**/*.spec.tsx"],
    ignores: ["**/node_modules/**", "config/**"],
    languageOptions: {
      globals: {
        describe: true,
        test: true,
        expect: true,
        beforeEach: true,
        afterEach: true,
        jest: true,
      },
    },
    plugins: {
      jest,
    },
    rules: {
      "jest/prefer-strict-equal": "warn",
      "jest/no-conditional-expect": "warn",
    },
  },
  prettier,
];
