import { getLogger, setLogger, CustomLogger } from "../../utils/logger";

jest.mock("pino");

describe("getLogger funcioality", () => {
  let consoleWarnSpy: jest.SpyInstance;

  const customLogger: CustomLogger = {
    trace: jest.fn(),
    warn: jest.fn(),
  };

  beforeEach(() => {
    consoleWarnSpy = jest.spyOn(console, "warn").mockImplementation(() => {});
  });

  afterEach(() => {
    consoleWarnSpy.mockRestore();
    jest.resetModules();
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
    const customLogger = {
      trace: jest.fn(),
      warn: jest.fn()
    };
  
    setLogger(customLogger);
    const logger = getLogger();

    logger.trace("Custom trace message");
    expect(customLogger.trace).toHaveBeenCalledWith("Custom trace message");
  
    logger.warn("Custom warn message");
    expect(customLogger.warn).toHaveBeenCalledWith("Custom warn message");
  });
  
});
