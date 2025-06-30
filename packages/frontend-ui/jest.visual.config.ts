import type { Config } from "@jest/types";

const config: Config.InitialOptions = {
    preset: "jest-playwright-preset",
    testMatch: ['**/browser-tests/**/*.visual.test.ts'],
    testTimeout: 30000,
    transform: {},
}

export default config;