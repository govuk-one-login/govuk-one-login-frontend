import { promisify } from "node:util";
import crypto from "node:crypto";
import type { Request, Response, NextFunction } from "express";

const randomBytes = promisify(crypto.randomBytes);

const cspNonce = async (req: Request, res: Response, next: NextFunction) => {
  res.locals.cspNonce = (await randomBytes(16)).toString("hex");

  next();
};

export { cspNonce };
