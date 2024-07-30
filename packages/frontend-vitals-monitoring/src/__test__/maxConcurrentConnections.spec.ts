import { IncomingMessage, Server, ServerResponse } from "http";
import { setup, teardown } from "../../test/testApp";
import pjson from "../../package.json";
import { type Logger } from "pino";
import {
  calculateMaxConcurrentConnections,
  getMaxConcurrentConnections,
} from "../maxConcurrentConnections/maxConcurrentConnections";

describe("maxConcurrentConnections", () => {
  let logger: Logger<never>;
  let server: Server<typeof IncomingMessage, typeof ServerResponse>;
  const interval = 10000; // Define interval variable

  beforeEach(() => {
    const testApp = setup({
      metrics: ["maxConcurrentConnections"],
      interval,
    });
    logger = testApp.logger;
    server = testApp.server;
  });

  afterEach(() => {
    teardown(server);
    // Clear all mocks after each test
    jest.restoreAllMocks(); // Clear all mocks after each test
  });
  it("should correctly calculate the maxConcurrentConnections", async () => {
    // Mock the getConnections method
    jest.spyOn(server, "getConnections").mockImplementation((callback) => {
      // Simulate a successful call with 5 active connections
      callback(null, 5);
    });

    // Call the function to calculate max concurrent connections
    calculateMaxConcurrentConnections(server, interval);

    jest.advanceTimersByTime(15000);
    expect(getMaxConcurrentConnections()).toBe(5);

    expect(logger.info).toHaveBeenLastCalledWith({
      version: pjson.version,
      maxConcurrentConnections: 5,
    });
    jest.clearAllMocks();
  });
  it("should return 0 if there are no requests made", async () => {
    // Call the function to calculate max concurrent connections
    calculateMaxConcurrentConnections(server, interval);

    jest.advanceTimersByTime(15000);

    expect(getMaxConcurrentConnections()).toBe(0);

    expect(logger.info).toHaveBeenLastCalledWith({
      version: pjson.version,
      maxConcurrentConnections: 0,
    });
  });
});
