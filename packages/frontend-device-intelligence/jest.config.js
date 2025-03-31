export default {
  collectCoverage: true,
  collectCoverageFrom: [
    "<rootDir>/src/**/*.ts",
    "!<rootDir>/src/**/*.interface.ts",
    "!<rootDir>/src/**/*.mock.ts",
    "!<rootDir>/src/**/*.spec.ts",
    "!<rootDir>/src/**/*.test.ts",
    "!<rootDir>/src/**/*.d.ts",
  ],
  preset: "ts-jest",
  testEnvironment: "jsdom",
};
