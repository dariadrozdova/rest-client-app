import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";

export default defineConfig({
  test: {
    environment: "jsdom",
    setupFiles: ["./vitest.setup.ts"],
    globals: true,
    coverage: {
      provider: "v8",
      include: [
        "app/**/*.{ts,tsx}",
        "shared/**/*.{ts,tsx}",
        "store/**/*.{ts,tsx}",
        "components/**/*.{ts,tsx}",
      ],
      exclude: [
        "**/node_modules/**",
        "**/.next/**",
        "**/coverage/**",
        "**/*.d.ts",
        "**/*.map",
        "**/vitest.*",
        "tests/**",
        "**/index.ts",
        "@shared/lib/i18n/messages/**/*.ts",
        "@shared/globals/*.ts",
        "@shared/types/*.ts",
      ],
      reporter: ["text", "html"],
      reportsDirectory: "coverage",
    },
  },
  esbuild: {
    jsx: "automatic",
    jsxImportSource: "react",
  },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./", import.meta.url)),
      "@app": fileURLToPath(new URL("./app", import.meta.url)),
      "@shared": fileURLToPath(new URL("./shared", import.meta.url)),
      "@store": fileURLToPath(new URL("./store", import.meta.url)),
      "@utils": fileURLToPath(new URL("./utils", import.meta.url)),
      "@workspace": fileURLToPath(new URL("./workspace", import.meta.url)),
    },
  },
});
