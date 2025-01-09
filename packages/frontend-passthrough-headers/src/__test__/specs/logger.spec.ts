import pino from "pino";
import { CustomLogger, getLogger, setLogger, resetLogger } from "../../utils/logger";

jest.mock("pino");

describe("getLogger functionality", () => {
  let consoleWarnSpy: jest.SpyInstance;

  const customLogger: CustomLogger = {
    trace: jest.fn(),
    warn: jest.fn(),
  };

  beforeEach(()=> {
    resetLogger();
    consoleWarnSpy = jest.spyOn(console, "warn").mockImplementation(() => {});
  });

  afterEach(() => {
    consoleWarnSpy.mockRestore();
    jest.clearAllMocks();
  });

  it("should return console when no logger is set", () => {
    const logger = getLogger();
    expect(consoleWarnSpy).toHaveBeenCalledWith("Warning: Logger is undefined");
    expect(logger).toBe(console);
  });

  it("should return the custom logger when set", () => {
    setLogger(customLogger);
    const logger = getLogger();
    expect(logger).toBe(customLogger);
  });
});

describe("setLogger", () => {
  it("sets the logger as custom logger if provided", () => {
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

    // Ensure `pino` was called with the correct configuration
    expect(pino).toHaveBeenCalledWith({
      name: "@govuk-one-login/frontend-passthrough-headers",
      level: expect.any(String)
    });
  });
});