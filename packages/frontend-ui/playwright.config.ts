import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
    testDir: "browser-tests/functional-tests",
    use: {
        baseURL: "http://localhost:3000",
        screenshot: "only-on-failure",
        trace: "on-first-retry",
        // viewport: { width: 1280, height: 720 },
        deviceScaleFactor: 1,
        headless: true,
        ignoreHTTPSErrors: true,
    },
    projects: [
        // {
        // use: {
        //     ...devices["Desktop Chrome"],
        //     headless: true,
        // },
        // },
        {
        name: "iphone",
        use: {
            ...devices["iPhone 15"],
            headless: true,
        },
        }

    ],
});