import { Events, EventKey } from "./types";
import { SendMessageCommand, SQSClient } from "@aws-sdk/client-sqs";
import logger from "./logger";

export function sendEventToSQS<K extends EventKey>(
  event: Events[K],
  url: string,
): void {
  sendAuditEvent(url, event);
}

let sqsClient: SQSClient | undefined;

export function getSqsClient(): SQSClient {
  sqsClient ??= new SQSClient({ region: "eu-west-2" });

  return sqsClient;
}

export async function sendAuditEvent<K extends EventKey>(
  queueUrl: string,
  auditEvent: Events[K],
) {
  logger.info(`Sending audit event...`);

  const response = await getSqsClient().send(
    new SendMessageCommand({
      QueueUrl: queueUrl,
      MessageBody: JSON.stringify(auditEvent),
    }),
  );

  logger.info(
    `Successfully fired ${auditEvent.event_name} event - SQS message id: '${response.MessageId}'; response code: ${response.$metadata?.httpStatusCode}`,
  );
}
