import { getLogger } from "@govuk-one-login/frontend-logger";
import type { Mock } from "vitest";

vi.mock("@govuk-one-login/frontend-logger", () => ({
  getLogger: vi.fn(),
}));

describe("logger functionality", () => {
  const mockTraceMessage = "warning message";
  (getLogger as Mock).mockReturnValue({
    trace: vi.fn(),
    warn: vi.fn(),
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should use the custom logger if provided", () => {
    const mockCustomLogger = {
      trace: vi.fn(),
      warn: vi.fn(),
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
