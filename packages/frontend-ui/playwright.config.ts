import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
    testDir: "browser-tests/functional-tests",
    use: {
        baseURL: "http://host.docker.internal:3000",
        screenshot: "only-on-failure",
        trace: "on-first-retry",
        deviceScaleFactor: 1,
        headless: true,
        ignoreHTTPSErrors: true,
    },
    projects: [
        {
            use: {
                ...devices["Desktop Chrome"],
                headless: true,
            },
        },
    ],
});