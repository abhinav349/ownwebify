import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  test: {
    globals: true,
    environment: "node",
    include: [
      "tests/unit/**/*.test.ts",
      "tests/integration/**/*.test.ts",
      "tests/e2e/**/*.spec.ts",
    ],
    setupFiles: ["tests/setup.ts"],
    // Provisions (and afterwards destroys) the accounts the auth suites log
    // in as, and hands their per-run passwords to tests via `inject`.
    globalSetup: ["tests/global-setup.ts"],
    testTimeout: 30000,
  },
});
