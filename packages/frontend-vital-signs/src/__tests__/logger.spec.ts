import { createLogger } from "../utils/logger";

const mockCreateLogger = vi.fn();

vi.mock("@govuk-one-login/frontend-logger", async () => ({
  createLogger: () => mockCreateLogger(),
}));

describe("initFromApp", () => {
  it("should create a logger using the library", () => {
    createLogger("info");
    expect(mockCreateLogger).toHaveBeenCalled();
  });
});
