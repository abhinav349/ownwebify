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
    /**
     * Run one spec file at a time.
     *
     * The integration and e2e suites are not self-contained units: they share
     * one dev server and one database, and each e2e file additionally drives
     * its own headless Chrome. Run in parallel, several browsers plus the API
     * suites hit a single Next dev server at once, and on-demand route
     * compilation under that load pushes navigations past the 30s timeout.
     * That surfaced as 3 of 17 e2e tests failing on the login redirect, with
     * *which* three varying per run — the signature of contention rather than
     * of a broken assertion. Serialising the files makes all 17 pass.
     *
     * The cost is near zero: the unit suite is ~46ms of actual test execution,
     * and everything slower than that was contending for the same two shared
     * resources anyway, so it was never really running in parallel.
     *
     * This belongs in config rather than on the `test:e2e` script because
     * plain `vitest run` executes all three suites together, and the
     * contention is worst in exactly that combination.
     */
    fileParallelism: false,
  },
});
