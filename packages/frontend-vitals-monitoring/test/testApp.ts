import pino, { type Logger } from "pino";
import { IncomingMessage, Server, ServerResponse } from "http";
import { createTestApp } from "./createTestApp";
import { frontendVitalsInit } from "../src";

jest.mock("pino", () => ({
  ...jest.requireActual("pino"),
  __esModule: true,
  default: jest.fn(),
}));

export function setup(options?: Parameters<typeof frontendVitalsInit>[1]) {
  process.env.LOG_LEVEL = "info";
  jest.useFakeTimers();

  const logger = {
    info: jest.fn(),
    warn: jest.fn(),
  };

  (pino as unknown as jest.Mock).mockReturnValue(logger);

  const server = createTestApp(options);

  return { logger, server };
}

export function teardown(
  server: Server<typeof IncomingMessage, typeof ServerResponse>,
) {
  jest.useRealTimers();
  server.close();
}
