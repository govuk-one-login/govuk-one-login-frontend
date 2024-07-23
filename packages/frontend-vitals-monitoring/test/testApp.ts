import pino, { type Logger } from "pino";
import { IncomingMessage, Server, ServerResponse } from "http";
import { createTestApp } from "./createTestApp";

jest.mock("pino", () => ({
  ...jest.requireActual("pino"),
  __esModule: true,
  default: jest.fn(),
}));

export function setup() {
  process.env.LOG_LEVEL = "info";
  jest.useFakeTimers();

  const logger = {
    info: jest.fn(),
    warn: jest.fn(),
  } as unknown as Logger<never>;

  (pino as unknown as jest.Mock).mockReturnValue(logger);

  const server = createTestApp({
    metrics: ["requestsPerSecond"],
    staticPaths: ["/test/static"],
  });

  return { logger, server };
}

export function teardown(
  server: Server<typeof IncomingMessage, typeof ServerResponse>,
) {
  jest.useRealTimers();
  server.close();
}
