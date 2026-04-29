import "vitest";
import { MatcherResult } from "vitest";
import type { Logger as PinoLogger } from "pino";

declare module "vitest" {
  interface Matchers {
    toMatchLogger: (received: PinoLogger) => MatcherResult;
  }
}
