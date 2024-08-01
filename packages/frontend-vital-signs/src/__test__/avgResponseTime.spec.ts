import request from "supertest";
import { setup, teardown } from "../../test/testApp";
import pjson from "../../package.json";

describe("averageResponseTime", () => {
  let logger: ReturnType<typeof setup>["logger"];
  let server: ReturnType<typeof setup>["server"];

  beforeEach(() => {
    const testApp = setup({
      metrics: ["avgResponseTime"],
      staticPaths: ["/test/static"],
    });
    logger = testApp.logger;
    server = testApp.server;
  });

  afterEach(() => {
    teardown(server);
  });

  it("should correctly calculate the average response time of dynamic and static endpoints", async () => {
    await request(server).get("/test/dynamic");
    await request(server).get("/test/static");
    await request(server).get("/test/static");

    jest.advanceTimersByTime(15000);

    expect(logger.info).toHaveBeenLastCalledWith({
      version: pjson.version,
      avgResponseTime: {
        dynamic: 0,
        static: 0,
      },
    });
  });
  it("should return null if there are no requests made", async () => {
    jest.advanceTimersByTime(15000);

    expect(logger.info).toHaveBeenLastCalledWith({
      version: pjson.version,
      avgResponseTime: {
        dynamic: null,
        static: null,
      },
    });
  });
});
