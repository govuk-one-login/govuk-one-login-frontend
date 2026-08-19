import crypto from "node:crypto";
import { promisify } from "node:util";
import type { NextFunction, Request, Response } from "express";

const randomBytes = promisify(crypto.randomBytes);

const cspNonce = async (_req: Request, res: Response, next: NextFunction) => {
  res.locals.cspNonce = (await randomBytes(16)).toString("hex");

  next();
};

export { cspNonce };
