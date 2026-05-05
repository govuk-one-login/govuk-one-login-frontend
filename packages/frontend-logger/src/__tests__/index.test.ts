import {
  createLogger,
  getLogger,
  resetLogger,
  setCustomLogger,
  type Logger,
} from "..";
import pino from "pino";

// Custom matcher for pseudo-deep equality: JSON string (does not include all properties), log level, name
expect.extend({
  toMatchLogger(received, expected) {
    const { isNot } = this;

    return {
      pass:
        JSON.stringify(expected) === JSON.stringify(received) &&
        expected?.level &&
        expected.level === received.level &&
        JSON.stringify(expected.bindings && expected.bindings()) ===
          JSON.stringify(received.bindings && received.bindings()),
      message: () =>
        `${received} ${isNot ? "matches" : "does not match"} ${expected}.
        Expected: ${JSON.stringify({ logLevel: expected.level, bindings: expected.bindings && expected.bindings() })} 
        Received: ${JSON.stringify({ logLevel: received.level, bindings: received.bindings && received.bindings() })} 
      `,
    };
  },
});

const defaultLogger = pino({
  name: "@govuk-one-login/default-logger",
  level: "warn",
});

const customLogger = {
  trace: vi.fn(),
  warn: vi.fn(),
  info: vi.fn(),
  error: vi.fn(),
};

describe("logger", () => {
  beforeEach(() => {
    resetLogger();
    vi.resetAllMocks();
  });

  it("should create a default logger on first get if none exists", () => {
    expect(getLogger() as Logger).toMatchLogger(defaultLogger);
  });

  it("should use a custom logger when one is provided", () => {
    setCustomLogger(customLogger);
    expect(customLogger).not.toMatchLogger(defaultLogger);
  });

  it("should warn if a logger is being overwritten by a custom logger", () => {
    const warnSpy = vi.spyOn(getLogger(), "warn");
    setCustomLogger(customLogger);
    expect(warnSpy).toHaveBeenCalledWith(
      "Setting custom logger when one already exists",
    );
  });

  it("should return a customised pino logger if one has been created", () => {
    const customisedLogger = createLogger({
      level: "error",
      name: "test",
    });
    expect(customisedLogger).not.toMatchLogger(defaultLogger);
  });

  it("should warn if a logger is being overwritten by a customised pino logger", () => {
    const warnSpy = vi.spyOn(getLogger(), "warn");
    createLogger({ level: "info" });
    expect(warnSpy).toHaveBeenCalledWith(
      "Creating new logger with config when one already exists",
    );
  });

  it("should return to using the default logger after being reset", () => {
    createLogger({ name: "@govuk-one-login/default-logger", level: "error" });
    expect(getLogger()).toMatchLogger(
      pino({
        name: "@govuk-one-login/default-logger",
        level: "error",
      }),
    );
    resetLogger();
    expect(getLogger()).toMatchLogger(defaultLogger);
  });
});
