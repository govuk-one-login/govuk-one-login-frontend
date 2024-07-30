import pino from "pino";
import { createTestApp } from "../../test/createTestApp";

jest.mock("pino", () => ({
  ...jest.requireActual("pino"),
  __esModule: true,
  default: jest.fn(),
}));

describe("frontendVitalsInit", () => {
  it("warns when log level is undefined", () => {
    delete process.env.LOG_LEVEL;

    jest.useFakeTimers();

    const logger = {
      info: jest.fn(),
      warn: jest.fn(),
    };

    (pino as unknown as jest.Mock).mockReturnValue(logger);

    const server = createTestApp();

    jest.advanceTimersByTime(15000);

    expect(logger.warn).toHaveBeenCalledWith(
      expect.stringContaining("Log level is undefined"),
    );

    server.close();
    jest.useRealTimers();
  });

  it("warns when log level is invalid", () => {
    process.env.LOG_LEVEL = "invalid_level";

    jest.useFakeTimers();

    const logger = {
      info: jest.fn(),
      warn: jest.fn(),
    };

    (pino as unknown as jest.Mock).mockReturnValue(logger);

    const server = createTestApp();

    jest.advanceTimersByTime(15000);

    expect(logger.warn).toHaveBeenCalledWith(
      expect.stringContaining("Invalid log level: invalid_level"),
    );

    server.close();
    jest.useRealTimers();
  });
});
