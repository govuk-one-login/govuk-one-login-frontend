import { defineConfig } from "@playwright/test";

export default defineConfig({
    testDir: "browser-tests/functional-tests",
    retries: process.env.CI ? 2 : 0,
    use: {
        baseURL: "http://localhost:3000",
        screenshot: "only-on-failure",
        trace: "on-first-retry",
        viewport: { width: 1280, height: 720 },
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