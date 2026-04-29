import { IncomingMessage, Server, ServerResponse } from "http";
import { createTestApp } from "./createTestApp";
import { frontendVitalSignsInit } from "../..";

const logger = {
  info: vi.fn(),
  warn: vi.fn(),
};

vi.mock("@govuk-one-login/frontend-logger", async () => ({
  getLogger: () => logger,
  createLogger: () => logger,
}));

export function setup(options?: Parameters<typeof frontendVitalSignsInit>[1]) {
  process.env.LOG_LEVEL = "info";
  vi.useFakeTimers();

  const server = createTestApp(options);

  return { logger, server };
}

export function teardown(
  server: Server<typeof IncomingMessage, typeof ServerResponse>,
) {
  vi.useRealTimers();
  server.close();
  logger.info.mockClear();
  logger.warn.mockClear();
}
