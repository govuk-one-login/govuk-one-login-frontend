import { type Request } from "express";
import { APIGatewayProxyEvent } from "aws-lambda";

export function getHeader(req: Request | APIGatewayProxyEvent, header: string) {
  const lowerCaseHeader = header.toLowerCase();
  const matchingKey = Object.keys(req.headers).find(
    (key) => key.toLowerCase() === lowerCaseHeader,
  );
  return matchingKey ? req.headers[matchingKey] : undefined;
}
