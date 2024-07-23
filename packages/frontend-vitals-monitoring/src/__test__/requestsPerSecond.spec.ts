import request from "supertest";
import { IncomingMessage, Server, ServerResponse } from "http";
import { setup, teardown } from "../../test/testApp";
import pjson from "../../package.json";
import { type Logger } from "pino";

describe("requestsPerSecond", () => {
  let logger: Logger<never>;
  let server: Server<typeof IncomingMessage, typeof ServerResponse>;

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
