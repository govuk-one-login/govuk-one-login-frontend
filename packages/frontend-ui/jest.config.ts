export default {
  collectCoverage: true,
  preset: "ts-jest",
  setupFiles: ["<rootDir>/src/test/jest.setup.ts"],
  testEnvironment: "jsdom",
  coveragePathIgnorePatterns: [
        "node_modules",
        "<rootDir>/src/test"
    ],
  moduleNameMapper: {
    "^canvas$": "<rootDir>/src/test/__mocks__/canvas.ts",
  },
};