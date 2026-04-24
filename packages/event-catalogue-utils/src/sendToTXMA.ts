import { createEvent, sendEventToSQS, validateEvent } from "./index.js";
import { EventKey, Events, Options } from "./types.js";
import logger from "./logger.js";
import _ from "lodash";

export function sendToTXMA<K extends EventKey>(
  type: K,
  entity: Events[K],
  queueUrl: string,
  options?: Options,
) {
  const event = createEvent(type, entity);
  const valid = validateEvent<K>(event);
  if (!valid) logger.info("Invalid event created: " + JSON.stringify(event));
  sendEventToSQS(event, queueUrl, options);
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

    sendToTXMA(type, event, queueUrl, {
      sqsClient,
      logParams,
    });
  };
