import { type Request } from "express";
import forwardedParse from "forwarded-parse";
import { logger } from "./logger";
import { APIGatewayProxyEvent } from "aws-lambda";
import { getHeader } from "./getHeader";
import { CustomLogger } from "./logger";

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
  return Object.prototype.hasOwnProperty.call(obj, "requestContext");
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

function handleCloudfrontIP(
  req: Request | APIGatewayProxyEvent,
  customLogger?: CustomLogger,
) {
  const loggerToUse = customLogger || logger;
  try {
    loggerToUse.trace(
      `Sourcing User IP from "${HEADER_CLOUDFRONT_VIEWER}" header.`,
    );
    const header = getHeader(req, HEADER_CLOUDFRONT_VIEWER);
    if (!header) return null;
    const firstIP = getFirstOrOnly(header);
    return parseIP(firstIP);
  } catch (e) {
    loggerToUse.warn(
      `Request received with invalid content in "${HEADER_CLOUDFRONT_VIEWER}" header.`,
    );
    return null;
  }
}

function handleForwardedIP(
  req: Request | APIGatewayProxyEvent,
  customLogger?: CustomLogger,
) {
  const loggerToUse = customLogger || logger;
  try {
    loggerToUse.trace(`Sourcing User IP from "${HEADER_FORWARDED}" header.`);
    const header = getHeader(req, HEADER_FORWARDED);
    if (!header) return null;
    const firstIP = getFirstOrOnly(header);
    const firstEntry = forwardedParse(firstIP)[0];
    return parseIP(firstEntry.for);
  } catch (e) {
    loggerToUse.warn(
      `Request received with invalid content in "${HEADER_FORWARDED}" header.`,
    );
    return null;
  }
}

function handleXForwardedForIP(
  req: Request | APIGatewayProxyEvent,
  customLogger?: CustomLogger,
) {
  const loggerToUse = customLogger || logger;
  try {
    loggerToUse.trace(`Sourcing User IP from "${HEADER_X_FORWARDED}" header.`);
    if (isAPIGatewayProxyEvent(req)) {
      const header = getHeader(req, HEADER_X_FORWARDED);
      if (!header) return null;
      const firstIP = getFirstOrOnly(header);
      const ip = firstIP.split(",")[0];
      return parseIP(ip);
    } else {
      return req.ip ?? null;
    }
  } catch (e) {
    loggerToUse.warn(
      `Request received with invalid content in "${HEADER_X_FORWARDED}" header.`,
    );
    return null;
  }
}

export function processUserIP(
  req: Request | APIGatewayProxyEvent,
  customLogger?: CustomLogger,
): string | null {
  const userIPSource = getUserIPSource(req);

  switch (userIPSource) {
    case IPSources.Cloudfront: {
      return handleCloudfrontIP(req, customLogger);
    }
    case IPSources.Forwarded: {
      return handleForwardedIP(req, customLogger);
    }
    case IPSources.XForwardedFor: {
      return handleXForwardedForIP(req, customLogger);
    }
    case IPSources.None:
    default:
      return null;
  }
}
