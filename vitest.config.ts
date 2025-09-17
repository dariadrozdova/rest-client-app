import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";

export default defineConfig({
  test: {
    environment: "jsdom",
    setupFiles: ["./vitest.setup.ts"],
    globals: true,
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
    },
  },
});
