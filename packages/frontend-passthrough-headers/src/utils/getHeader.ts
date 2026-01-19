import { type Request } from "express";
import type { APIGatewayProxyEvent } from "aws-lambda";

export function getHeader(req: Request | APIGatewayProxyEvent, header: string) {
  const lowerCaseHeader = header.toLowerCase();
  if (!req.headers) return undefined;
  const matchingKey = Object.keys(req.headers).find(
    (key) => key.toLowerCase() === lowerCaseHeader,
  );
  return matchingKey ? req.headers[matchingKey] : undefined;
}
