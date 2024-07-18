import request from "supertest";
import { IncomingMessage, Server, ServerResponse } from "http";
import { createTestApp } from "../../test/testUtils";
import { getLogger } from "../utils/logger";
import pjson from "../../package.json";

let server: Server<typeof IncomingMessage, typeof ServerResponse>;

describe("requestsPerSecond", () => {
  beforeEach(() => {
    process.env.LOG_LEVEL = "info";
    jest.useFakeTimers();
    server = createTestApp({
      metrics: ["requestsPerSecond"],
      staticPaths: ["/test/static"],
    });
  });

  afterEach(() => {
    jest.useRealTimers();
    server.close();
  });

  it("should correctly list ", async () => {
    const logger = getLogger();
    const loggerSpy = jest.spyOn(logger, "info");

    await request(server).get("/test/dynamic");
    await request(server).get("/test/static");
    await request(server).get("/test/static");

    jest.advanceTimersByTime(15000);

    expect(loggerSpy).toHaveBeenLastCalledWith({
      version: pjson.version,
      requestsPerSecond: {
        dynamic: 0.1,
        static: 0.2,
      },
    });
  });
});
