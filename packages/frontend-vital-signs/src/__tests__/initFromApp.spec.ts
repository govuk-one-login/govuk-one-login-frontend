import express from "express";
import pjson from "../../package.json";
import { frontendVitalSignsInitFromApp } from "..";

const logger = {
  info: vi.fn(),
  warn: vi.fn(),
};

vi.mock("@govuk-one-login/frontend-logger", async () => ({
  getLogger: () => logger,
  createLogger: () => logger,
}));

const PORT = 0;

describe("initFromApp", () => {
  beforeEach(() => {
    process.env.LOG_LEVEL = "info";
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should log metrics when provided with an express app", () => {
    const app = express();

    frontendVitalSignsInitFromApp(app, {
      metrics: [],
    });

    app.get("/test/dynamic", (req, res) => {
      res.status(200).send("Dynamic test endpoint called.");
    });

    app.get("/test/static", (req, res) => {
      res.status(200).send("Static test endpoint called.");
    });

    const server = app.listen(PORT, () => {
      console.log(`Test app listening on port ${PORT}`);
    });

    vi.advanceTimersByTime(15000);

    expect(logger.info).toHaveBeenLastCalledWith({
      version: pjson.version,
    });

    server.close();
  });
});
