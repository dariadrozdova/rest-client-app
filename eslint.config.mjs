import js from "@eslint/js";
import nextPlugin from "@next/eslint-plugin-next";
import eslintPluginImport from "eslint-plugin-import";
import eslintPluginNoRelativeImportPaths from "eslint-plugin-no-relative-import-paths";
import perfectionist from "eslint-plugin-perfectionist";
import eslintPluginPrettier from "eslint-plugin-prettier/recommended";
import react from "eslint-plugin-react";
import reactCompiler from "eslint-plugin-react-compiler";
import reactHooks from "eslint-plugin-react-hooks";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import unicorn from "eslint-plugin-unicorn";
import unusedImports from "eslint-plugin-unused-imports";
import globals from "globals";
import path from "node:path";
import { fileURLToPath } from "node:url";
import tseslint from "typescript-eslint";

import { eslintRules } from "./_configs/eslint-rules.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default tseslint.config(
  {
    ignores: [
      "**/node_modules/**",
      ".next/**",
      "__content/**",
      "dist/**",
      "coverage/**",
      "**/*.js",
      "**/*.d.ts",
      "**/*.config.js",
      "**/*.config.ts",
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...tseslint.configs.stylistic,
  perfectionist.configs["recommended-natural"],
  unicorn.configs.recommended,
  eslintPluginPrettier,
  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      ecmaVersion: "latest",
      globals: {
        ...globals.browser,
        ...globals.node,
      },
      parser: tseslint.parser,
      parserOptions: {
        projectService: true,
        tsconfigRootDir: __dirname,
      },
      sourceType: "module",
    },
    plugins: {
      "@next/next": nextPlugin,
      import: eslintPluginImport,
      "no-relative-import-paths": eslintPluginNoRelativeImportPaths,
      react: react,
      "react-compiler": reactCompiler,
      "react-hooks": reactHooks,
      "simple-import-sort": simpleImportSort,
      "unused-imports": unusedImports,
    },
    rules: {
      ...eslintRules,
      "@next/next/no-before-interactive-script-outside-document": "error",
      "@next/next/no-css-tags": "error",
      "@next/next/no-head-element": "error",
      "@next/next/no-html-link-for-pages": "error",
      "@next/next/no-img-element": "error",
      "@next/next/no-page-custom-font": "error",
      "@next/next/no-script-component-in-head": "error",
      "@next/next/no-styled-jsx-in-document": "error",
      "@next/next/no-sync-scripts": "error",
      "@next/next/no-title-in-document-head": "error",
      "@next/next/no-unwanted-polyfillio": "error",
      "no-relative-import-paths/no-relative-import-paths": [
        "error",
        {
          allowSameFolder: false,
          prefix: "@",
          rootDir: ".",
        },
      ],
      "perfectionist/sort-imports": "off",
      "react-compiler/react-compiler": "error",
      "simple-import-sort/exports": "error",
      "simple-import-sort/imports": [
        "error",
        {
          groups: [
            [String.raw`^\u0000`],
            ["^node:"],
            ["^react", "^next"],
            [String.raw`^@?\w`],
            [
              "^(@api|@app|@components|@hooks|@pages|@utils|@types|@store|@context|@lib|@__test__)(/.*)?$",
            ],
            [String.raw`^\.\.(?!/?$)`, String.raw`^\.\./?$`],
            [
              String.raw`^\./(?=.*/)(?!.*\.(css|less|scss|sass|styl))$`,
              String.raw`^\.(?!/?$)`,
              String.raw`^\./?$`,
            ],
            [String.raw`^.+\.(css|less|scss|sass|styl)$`],
          ],
        },
      ],
      "unused-imports/no-unused-imports": "error",
    },
    settings: {
      "import/resolver": {
        alias: {
          extensions: [".ts", ".tsx", ".js", ".jsx"],
          map: [
            ["@", "."],
            ["@app", "./app"],
            ["@components", "./components"],
            ["@lib", "./lib"],
            ["@utils", "./utils"],
            ["@types", "./types"],
            ["@hooks", "./hooks"],
            ["@store", "./store"],
            ["@api", "./api"],
          ],
        },
        typescript: {
          project: "./tsconfig.json",
        },
      },
      next: {
        rootDir: __dirname,
      },
      react: {
        version: "detect",
      },
    },
  },
);
