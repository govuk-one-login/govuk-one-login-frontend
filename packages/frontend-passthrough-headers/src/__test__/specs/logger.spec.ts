import pino from "pino";
import {
  CustomLogger,
  getLogger,
  setLogger,
  resetLogger,
} from "../../utils/logger";

jest.mock("pino");

describe("Logger functionality", () => {
  let consoleWarnSpy: jest.SpyInstance;

  const customLogger: CustomLogger = {
    trace: jest.fn(),
    warn: jest.fn(),
  };

  beforeEach(() => {
    resetLogger();
    consoleWarnSpy = jest.spyOn(console, "warn").mockImplementation(() => {});
  });

  afterEach(() => {
    consoleWarnSpy.mockRestore();
    jest.clearAllMocks();
  });

  describe("getLogger", () => {
    it("should return console when no logger is set", () => {
      const logger = getLogger();
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        "Warning: Logger is undefined",
      );
      expect(logger).toBe(console);
    });

    it("should return the custom logger when set", () => {
      setLogger(customLogger);
      const logger = getLogger();
      expect(logger).toBe(customLogger);
    });
  });

  describe("setLogger", () => {
    it("sets the logger as default pino logger if no custom logger is provided", () => {
      const mockPinoLogger = {
        trace: jest.fn(),
        warn: jest.fn(),
      };

      (pino as unknown as jest.Mock).mockReturnValue(mockPinoLogger);

      setLogger();
      const logger = getLogger();

      logger.trace("Test trace message");
      logger.warn("Test warn message");

      expect(mockPinoLogger.trace).toHaveBeenCalledWith("Test trace message");
      expect(mockPinoLogger.warn).toHaveBeenCalledWith("Test warn message");

      expect(pino).toHaveBeenCalledWith({
        name: "@govuk-one-login/frontend-passthrough-headers",
        level: expect.any(String),
      });
    });

    it("returns warning if logger already exists", () => {
      setLogger(customLogger);

      const customLoggerDupe: CustomLogger = {
        trace: jest.fn(),
        warn: jest.fn(),
      };

      setLogger(customLoggerDupe);
      const logger = getLogger();

      expect(logger).toBe(customLogger);
      expect(logger).not.toBe(customLoggerDupe);
      expect(logger.warn).toHaveBeenCalledWith(
        "Warning: Logging instance already exists",
      );
    });
  });
});
