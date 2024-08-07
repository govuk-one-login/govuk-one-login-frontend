import request from "supertest";
import { setup, teardown } from "../../test/testApp";
import pjson from "../../package.json";

describe("requestsPerSecond", () => {
  let logger: ReturnType<typeof setup>["logger"];
  let server: ReturnType<typeof setup>["server"];

  beforeEach(() => {
    const testApp = setup({
      metrics: ["requestsPerSecond"],
      staticPaths: ["/test/static"],
    });
    logger = testApp.logger;
    server = testApp.server;
  });

  afterEach(() => {
    teardown(server);
  });

  it("should correctly list the proportion of dynamic and static endpoints", async () => {
    await request(server).get("/test/dynamic");
    await request(server).get("/test/static");
    await request(server).get("/test/static");

    jest.advanceTimersByTime(15000);

    expect(logger.info).toHaveBeenLastCalledWith({
      version: pjson.version,
      requestsPerSecond: {
        dynamic: 0.1,
        static: 0.2,
      },
    });
  });
});
