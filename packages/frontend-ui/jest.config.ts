export default {
  collectCoverage: true,
  preset: "ts-jest",
  setupFiles: ["<rootDir>/test/jest.setup.ts"],
  testEnvironment: "jsdom",
};