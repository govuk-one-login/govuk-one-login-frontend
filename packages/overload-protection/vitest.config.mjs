import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    globals: true,
    include: ["test/**/*.test.js"],
    coverage: {
      provider: "v8",
      reporter: ["text", "lcov"],
      include: ["index.js"],
    },
    // event-loop timing tests must not run in parallel with each other
    fileParallelism: false,
  },
});
