import { Events, EventKey } from "./types";
import { SendMessageCommand, SQSClient } from "@aws-sdk/client-sqs";
import logger from "./logger";
import _ from "lodash";

export const getDefaultSQSClient = _.memoize(
  () => new SQSClient({ region: "eu-west-2" }),
);

export async function sendEventToSQS<K extends EventKey>(
  auditEvent: Events[K],
  queueUrl: string,
  sqsClient?: SQSClient,
) {
  logger.info(`Sending audit event...`);

  const preferredClient = sqsClient || getDefaultSQSClient();

  const response = await preferredClient.send(
    new SendMessageCommand({
      QueueUrl: queueUrl,
      MessageBody: JSON.stringify(auditEvent),
    }),
  );

  logger.info(
    `Successfully fired ${auditEvent.event_name} event - SQS message id: '${response.MessageId}'; response code: ${response.$metadata?.httpStatusCode}`,
  );
}
