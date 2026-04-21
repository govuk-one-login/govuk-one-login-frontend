import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [],
  test: {
    pool: "vmThreads",
    include: ["**/*.test.ts", "**/*.spec.ts"],
    exclude: ["**/*.visual.test.ts"],
    globals: true,
    environment: "jsdom",
    coverage: {
      provider: "v8",
      reporter: ["text", "lcov"],
    },
  },
});
