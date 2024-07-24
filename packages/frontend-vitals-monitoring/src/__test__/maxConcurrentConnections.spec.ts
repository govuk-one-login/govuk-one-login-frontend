import { IncomingMessage, Server, ServerResponse } from "http";
import { setup, teardown } from "../../test/testApp";
import pjson from "../../package.json";
import { type Logger } from "pino";
import { calculateMaxConcurrentConnections } from "../maxConcurrentConnections/maxConcurrentConnections";

describe("maxConcurrentConnections", () => {
  let logger: Logger<never>;
  let server: Server<typeof IncomingMessage, typeof ServerResponse>;

  beforeEach(() => {
    const testApp = setup({
      metrics: ["maxConcurrentConnections"],
    });
    logger = testApp.logger;
    server = testApp.server;
  });

  afterEach(() => {
    teardown(server);
  });

  it("should correctly calculate the maxConcurrentConnections", async () => {
    // Mock the getConnections method
    jest.spyOn(server, "getConnections").mockImplementation((callback) => {
      // Simulate a successful call with 5 active connections
      callback(null, 5);
    });

    // Call the function to calculate max concurrent connections
    calculateMaxConcurrentConnections(server);

    jest.advanceTimersByTime(15000);

    expect(logger.info).toHaveBeenLastCalledWith({
      version: pjson.version,
      maxConcurrentConnections: 5,
    });
  });

  it("should return 0 if there are no requests made", async () => {
    jest.advanceTimersByTime(15000);

    // Call the function to calculate max concurrent connections
    calculateMaxConcurrentConnections(server);

    expect(logger.info).toHaveBeenLastCalledWith({
      version: pjson.version,
      maxConcurrentConnections: 0,
    });
  });
});
