import type { NextFunction, Request, Response } from "express";

declare namespace overloadProtection {
  interface Options {
    /** Maximum event loop delay (ms) over the last second above which requests are shed. Default 200. */
    maxEventLoopDelay?: number;
  }
}

declare function overloadProtection(
  options?: overloadProtection.Options,
): (req: Request, res: Response, next: NextFunction) => void;

export = overloadProtection;
