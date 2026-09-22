import "vitest";
import type { Logger as PinoLogger } from "pino";
import { MatcherResult } from "vitest";

declare module "vitest" {
  interface Matchers {
    toMatchLogger: (received: PinoLogger) => MatcherResult;
  }
}
