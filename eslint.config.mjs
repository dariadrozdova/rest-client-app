import { FlatCompat } from "@eslint/eslintrc";
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
import { fileURLToPath } from "node:url";
import tseslint from "typescript-eslint";
import path from "node:path";

import { eslintRules } from "./_configs/eslint-rules.js";

const compat = new FlatCompat({
  baseDirectory: import.meta.dirname,
});

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

  ...compat.config({
    extends: ["next"],
    rules: {
      "@next/next/no-page-custom-font": "off",
      "react/no-unescaped-entities": "off",
    },
  }),
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
      "no-relative-import-paths/no-relative-import-paths": [
        "error",
        {
          allowSameFolder: false,
          prefix: "@",
          rootDir: ".",
        },
      ],
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

      "unicorn/filename-case": "off",
      "unicorn/no-empty-file": "off",
      "unicorn/prefer-string-raw": "off",

      "perfectionist/sort-imports": "off",
      "perfectionist/sort-objects": "off",

      "react-compiler/react-compiler": "error",
      "simple-import-sort/exports": "off",
      "simple-import-sort/imports": [
        "error",
        {
          groups: [
            [String.raw`^\u0000`],
            ["^node:"],
            ["^react", "^next"],
            [String.raw`^@?\w`],
            [
              "^(@api|@app|@components|@hooks|@shared|@pages|@utils|@types|@store|@context|@lib|@__test__)(/.*)?$",
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
  {
    files: ["**/*.test.ts", "**/*.test.tsx", "__tests__/**", "tests/**"],
    rules: {
      // В моках можно рендерить <img> (мы часто эмулируем next/image)
      "@next/next/no-img-element": "off",

      // Уберём ложные срабатывания на числа в тестах:
      // - разрешаем enum-ы и числовые literal-типы
      // - по желанию можно добавить常 используемые числа в ignore
      "@typescript-eslint/no-magic-numbers": [
        "error",
        {
          ignoreEnums: true,
          ignoreNumericLiteralTypes: true,
          ignore: [0, 1], // добавь сюда свои «разрешённые» числа, если нужно
        },
      ],

      // Чтобы можно было именовать неиспользуемые переменные/аргументы с префиксом _
      "@typescript-eslint/no-unused-vars": [
        "error",
        { varsIgnorePattern: "^_", argsIgnorePattern: "^_" },
      ],

      // В моках Vitest часто просит вынести функции наружу; если мешает — отключаем строгость
      "unicorn/consistent-function-scoping": "off",
    },
  },

  {
    files: ["**/eslint.config.{js,cjs,mjs}"],
    rules: {
      "perfectionist/sort-imports": "off",
      "perfectionist/sort-objects": "off",
    },
  },
);
