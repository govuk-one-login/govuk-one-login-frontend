import pino from "pino";
import { IncomingMessage, Server, ServerResponse } from "http";
import { createTestApp } from "./createTestApp";
import { frontendVitalSignsInit } from "../..";
import { type Mock } from "vitest";

vi.mock("pino", async () => ({
  ...(await vi.importActual("pino")),
  __esModule: true,
  default: vi.fn(),
}));

export function setup(options?: Parameters<typeof frontendVitalSignsInit>[1]) {
  process.env.LOG_LEVEL = "info";
  vi.useFakeTimers();

  const logger = {
    info: vi.fn(),
    warn: vi.fn(),
  };

  (pino as unknown as Mock).mockReturnValue(logger);

  const server = createTestApp(options);

  return { logger, server };
}

export function teardown(
  server: Server<typeof IncomingMessage, typeof ServerResponse>,
) {
  vi.useRealTimers();
  server.close();
}
