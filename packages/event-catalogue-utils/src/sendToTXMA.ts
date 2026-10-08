import _ from "lodash";
import { createEvent, sendEventToSQS, validateEvent } from "./index.js";
import logger from "./logger.js";
import type { EventKey, Events, Options } from "./types.js";

export async function sendToTXMA<K extends EventKey>(
  type: K,
  entity: Events[K],
  queueUrl: string,
  options?: Options,
) {
  const event = createEvent(type, entity);
  const valid = await validateEvent(event);
  if (!valid) logger.info(`Invalid event created: ${JSON.stringify(event)}`);
  await sendEventToSQS(event, queueUrl, options);
}

export const customSendToTXMA =
  (queueUrl: string, options: Options) =>
  <K extends EventKey>(
    type: K,
    event: Events[K],
    runtimeLogParams?: string,
  ) => {
    const { sqsClient, logParams: customLogParams } = options || {};
    const logParams = _.union(customLogParams, runtimeLogParams);

    return sendToTXMA(type, event, queueUrl, {
      sqsClient,
      logParams,
    });
  };
