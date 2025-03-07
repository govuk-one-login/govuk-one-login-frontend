import pino from "pino";
import {
  CustomLogger,
  getLogger,
  setCustomLogger,
  resetLogger,
} from "../utils/logger";

jest.mock("pino");

describe("Logger functionality", () => {
  const customLogger: CustomLogger = {
    trace: jest.fn(),
    warn: jest.fn(),
  };

  beforeEach(() => {
    resetLogger();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("getLogger", () => {
    it("should be called with default pino logger when no custom logger is set", () => {
      const logger = getLogger();
      expect(logger).toBe(
        pino({
          name: "@govuk-one-login/frontend-passthrough-headers",
          level: expect.any(String),
        }),
      );
    });

    it("should return the custom logger when set", () => {
      setCustomLogger(customLogger);
      const logger = getLogger();
      expect(logger).toBe(customLogger);
    });
  });

  describe("setCustomLogger", () => {
    it("sets the logger as custom logger if provided", () => {
      const mockPinoLogger = {
        trace: jest.fn(),
        warn: jest.fn(),
      };

      (pino as unknown as jest.Mock).mockReturnValue(mockPinoLogger);

      setCustomLogger(mockPinoLogger);

      const logger = getLogger();

      logger.trace("Test trace message");
      logger.warn("Test warn message");

      expect(mockPinoLogger.trace).toHaveBeenCalledWith("Test trace message");
      expect(mockPinoLogger.warn).toHaveBeenCalledWith("Test warn message");
    });
  });
});
