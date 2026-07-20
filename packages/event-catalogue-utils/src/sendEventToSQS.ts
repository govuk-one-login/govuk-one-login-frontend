import { Events, EventKey, Options } from "./types.js";
import { SendMessageCommand, SQSClient } from "@aws-sdk/client-sqs";
import logger from "./logger.js";
import _ from "lodash";

export const getDefaultSQSClient = _.memoize(
  () => new SQSClient({ region: "eu-west-2" }),
);

export async function sendEventToSQS<K extends EventKey>(
  event: Events[K],
  queueUrl: string,
  options?: Options,
) {
  const { sqsClient, logParams } = options || {};
  logger.info(`Sending audit event...`);

  const preferredClient = sqsClient || getDefaultSQSClient();

  const response = await preferredClient.send(
    new SendMessageCommand({
      QueueUrl: queueUrl,
      MessageBody: JSON.stringify(event),
    }),
  );

  const logMessage = `Successfully fired ${event.event_name} event - SQS message id: '${response.MessageId}'; response code: ${response.$metadata?.httpStatusCode}`;
  if (logParams) {
    logger.info(_.pick(event, logParams), logMessage);
  } else {
    logger.info(logMessage);
  }
}
