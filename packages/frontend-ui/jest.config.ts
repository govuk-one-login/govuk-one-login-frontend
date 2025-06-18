export default {
  collectCoverage: true,
  preset: "ts-jest",
  setupFiles: ["<rootDir>/src/test/jest.setup.ts"],
  testEnvironment: "jsdom",
  coveragePathIgnorePatterns: [
        "node_modules",
        "<rootDir>/src/test"
    ],
};