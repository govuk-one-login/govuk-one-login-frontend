import { getLogger } from "../utils/logger";

jest.mock("../utils/logger", () => ({
  getLogger: jest.fn(),
}));

describe("logger functionality", () => {
  const mockTraceMessage = "warning message";
  (getLogger as jest.Mock).mockReturnValue({
    trace: jest.fn(),
    warn: jest.fn(),
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should use the custom logger if provided", () => {
    const mockCustomLogger = {
      trace: jest.fn(),
      warn: jest.fn(),
    };

    mockCustomLogger.trace(mockTraceMessage);

    expect(mockCustomLogger.trace).toHaveBeenCalledWith(mockTraceMessage);
    expect(getLogger().trace).not.toHaveBeenCalled();
  });

  it("should use default logger if custom logger is not provided", () => {
    getLogger().warn(mockTraceMessage);

    expect(getLogger().warn).toHaveBeenCalledWith(mockTraceMessage);
  });
});
