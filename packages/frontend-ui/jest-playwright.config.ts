import type { JestPlaywrightConfig } from "jest-playwright-preset";

const config: JestPlaywrightConfig = {
    browsers: [ 'chromium' ],
    launchOptions: { headless: true },
    serverOptions: {
        command: "npm run start",
        port: 3000,
        protocol: "http",
        launchTimeout: 10000,
        debug: true,
    },
};

export default config;