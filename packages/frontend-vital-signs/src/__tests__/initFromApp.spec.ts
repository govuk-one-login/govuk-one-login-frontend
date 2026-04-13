import express from "express";
import pino, { type Logger } from "pino";
import pjson from "../../package.json";
import { frontendVitalSignsInitFromApp } from "..";
import { type Mock } from "vitest";

vi.mock("pino", async () => ({
  ...(await vi.importActual("pino")),
  __esModule: true,
  default: vi.fn(),
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
    const logger = {
      info: vi.fn(),
      warn: vi.fn(),
    } as unknown as Logger<never>;

    (pino as unknown as Mock).mockReturnValue(logger);

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
