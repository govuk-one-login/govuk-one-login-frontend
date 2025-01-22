import { type Request } from "express";
import { getLogger } from "./utils/logger";
import { processUserIP } from "./utils/userIP";
import { APIGatewayProxyEvent } from "aws-lambda";
import { getHeader } from "./utils/getHeader";
export { setCustomLogger } from "./utils/logger";

const HEADERS = {
  HEADER_TXMA: "txma-audit-encoded",
  OUTBOUND_FORWARDED_HEADER: "x-forwarded-for",
} as const;

export interface PersonalDataHeaders {
  [HEADERS.HEADER_TXMA]?: string;
  [HEADERS.OUTBOUND_FORWARDED_HEADER]?: string;
}

/**
 * This function extracts request headers that should be passed through
 * to INTERNAL backends. These headers contain Personal Data. They should NEVER
 * be forwarded to external services.
 *
 * @param {string} url - The downstream url this request is being sent on to.
 * @param {object} req - A node HTTP/Express type request.
 * @returns {PersonalDataHeaders}
 */
export function createPersonalDataHeaders(
  url: string,
  req: Request | APIGatewayProxyEvent,
): PersonalDataHeaders {
  const domain = new URL(url).hostname;
  const personalDataHeaders: PersonalDataHeaders = {};

  const txmaAuditEncodedHeader = getHeader(req, HEADERS.HEADER_TXMA) as string;
  const logger = getLogger();

  if (txmaAuditEncodedHeader) {
    personalDataHeaders[HEADERS.HEADER_TXMA] = txmaAuditEncodedHeader;
    logger.trace(
      `Personal Data header "${HEADERS.HEADER_TXMA}" is being forwarded to domain "${domain}"`,
    );
  }

  const userIP = processUserIP(req);
  if (userIP) {
    personalDataHeaders[HEADERS.OUTBOUND_FORWARDED_HEADER] = userIP;
    logger.trace(
      `Personal Data header "${HEADERS.OUTBOUND_FORWARDED_HEADER}" is being forwarded to domain "${domain}"`,
    );
  }

  return personalDataHeaders;
}

/**
 * This function extracts request headers that should be passed through
 * to INTERNAL backends. These headers contain Personal Data. They should NEVER
 * be forwarded to external services.
 *
 * @param {string} url - The downstream url this request is being sent on to.
 * @param {object} req - A node HTTP/Express type request.
 * @returns {PersonalDataHeaders}
 */
