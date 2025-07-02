import { defineConfig } from "@playwright/test";

export default defineConfig({
    testDir: "browser-tests/functional-tests",
    use: {
        baseURL: "http://localhost:3000",
        screenshot: "only-on-failure",
        trace: "on-first-retry",
        deviceScaleFactor: 1,
        headless: true,
    },
    projects: [
        {
            name: 'chromium',
            use: { browserName: "chromium" }
        }
    ],
});