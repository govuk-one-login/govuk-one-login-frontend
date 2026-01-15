/* eslint-disable @typescript-eslint/no-unused-vars */
import { type Request } from "express";
import forwardedParse from "forwarded-parse";
import { getLogger } from "./logger";
import type { APIGatewayProxyEvent } from "aws-lambda";
import { getHeader } from "./getHeader";

const HEADER_CLOUDFRONT_VIEWER = "cloudfront-viewer-address";
const HEADER_FORWARDED = "forwarded";
const HEADER_X_FORWARDED = "x-forwarded-for";

enum IPSources {
  Cloudfront,
  Forwarded,
  None,
  XForwardedFor,
}

function isAPIGatewayProxyEvent(
  obj: Request | APIGatewayProxyEvent,
): obj is APIGatewayProxyEvent {
  return Object.hasOwn(obj, "requestContext");
}

function parseIP(ip: string) {
  const url = new URL(`http://${ip}`);
  return url.hostname.replace(/[[\]]/gi, "");
}

function getFirstOrOnly(value: string | string[]) {
  return Array.isArray(value) ? value[0] : value;
}

function getUserIPSource(req: Request | APIGatewayProxyEvent): IPSources {
  if (getHeader(req, HEADER_CLOUDFRONT_VIEWER)) return IPSources.Cloudfront;
  if (getHeader(req, HEADER_FORWARDED)) return IPSources.Forwarded;
  if (getHeader(req, HEADER_X_FORWARDED)) return IPSources.XForwardedFor;
  return IPSources.None;
}

function handleCloudfrontIP(req: Request | APIGatewayProxyEvent) {
  const logger = getLogger();

  try {
    logger.trace(`Sourcing User IP from "${HEADER_CLOUDFRONT_VIEWER}" header.`);
    const header = getHeader(req, HEADER_CLOUDFRONT_VIEWER);
    if (!header) return null;
    const firstIP = getFirstOrOnly(header);
    return parseIP(firstIP);
  } catch {
    logger.warn(
      `Request received with invalid content in "${HEADER_CLOUDFRONT_VIEWER}" header.`,
    );
    return null;
  }
}

function handleForwardedIP(req: Request | APIGatewayProxyEvent) {
  const logger = getLogger();

  try {
    logger.trace(`Sourcing User IP from "${HEADER_FORWARDED}" header.`);
    const header = getHeader(req, HEADER_FORWARDED);
    if (!header) return null;
    const firstIP = getFirstOrOnly(header);
    const firstEntry = forwardedParse(firstIP)[0];
    return parseIP(firstEntry.for);
  } catch {
    logger.warn(
      `Request received with invalid content in "${HEADER_FORWARDED}" header.`,
    );
    return null;
  }
}

function handleXForwardedForIP(req: Request | APIGatewayProxyEvent) {
  const logger = getLogger();
  try {
    logger.trace(`Sourcing User IP from "${HEADER_X_FORWARDED}" header.`);
    if (isAPIGatewayProxyEvent(req)) {
      const header = getHeader(req, HEADER_X_FORWARDED);
      if (!header) return null;
      const firstIP = getFirstOrOnly(header);
      const ip = firstIP.split(",")[0];
      return parseIP(ip);
    } else {
      return req.ip ?? null;
    }
  } catch {
    logger.warn(
      `Request received with invalid content in "${HEADER_X_FORWARDED}" header.`,
    );
    return null;
  }
}

export function processUserIP(
  req: Request | APIGatewayProxyEvent,
): string | null {
  const userIPSource = getUserIPSource(req);

  switch (userIPSource) {
    case IPSources.Cloudfront: {
      return handleCloudfrontIP(req);
    }
    case IPSources.Forwarded: {
      return handleForwardedIP(req);
    }
    case IPSources.XForwardedFor: {
      return handleXForwardedForIP(req);
    }
    case IPSources.None:
    default:
      return null;
  }
}
