import { SQSClient } from "@aws-sdk/client-sqs";
import { createEvent, sendEventToSQS, validateEvent } from ".";
import { EventKey, Events } from "./types";
import logger from "./logger";

export function sendToTXMA<K extends EventKey>(
  type: K,
  entity: Events[K],
  queueUrl: string,
  sqsClient?: SQSClient,
) {
  const event = createEvent(type, entity);
  const valid = validateEvent<K>(event);
  if (!valid) logger.info("Invalid event created: " + JSON.stringify(event));
  sendEventToSQS(event, queueUrl, sqsClient);
}

export const customSendToTXMA =
  (queueUrl: string, sqsClient: SQSClient) =>
  <K extends EventKey>(type: K, entity: Events[K]) =>
    sendToTXMA(type, entity, queueUrl, sqsClient);
