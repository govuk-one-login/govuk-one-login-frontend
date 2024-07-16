import request from "supertest";
import { setup, teardown } from "../../test/testApp";

describe("eventLoopDelay", () => {
  let logger: ReturnType<typeof setup>["logger"];
  let server: ReturnType<typeof setup>["server"];

  beforeEach(() => {
    const testApp = setup({
      metrics: ["eventLoopUtilization"],
    });
    logger = testApp.logger;
    server = testApp.server;
  });

  afterEach(() => {
    teardown(server);
  });

  it("should log event loop utilization numbers when the metric is turned on", async () => {
    await request(server).get("/test/dynamic");
    await request(server).get("/test/static");
    await request(server).get("/test/static");

    jest.advanceTimersByTime(15000);

    expect(typeof logger.info.mock.calls[0][0].eventLoopUtilization.idle).toBe(
      "number",
    );
    expect(
      typeof logger.info.mock.calls[0][0].eventLoopUtilization.active,
    ).toBe("number");
    expect(
      typeof logger.info.mock.calls[0][0].eventLoopUtilization.utilization,
    ).toBe("number");

    expect(
      logger.info.mock.calls[0][0].eventLoopUtilization.idle,
    ).toBeGreaterThanOrEqual(0);
    expect(
      logger.info.mock.calls[0][0].eventLoopUtilization.active,
    ).toBeGreaterThanOrEqual(0);
    expect(
      logger.info.mock.calls[0][0].eventLoopUtilization.utilization,
    ).toBeGreaterThanOrEqual(0);
  });
});
