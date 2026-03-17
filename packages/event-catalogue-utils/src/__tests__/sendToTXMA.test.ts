import { SQSClient } from "@aws-sdk/client-sqs";
import { sendToTXMA, customSendToTXMA } from "../";
import { EventKey } from "../types";

const createEventMock = jest.fn((_: string, entity: object) => entity);
const validateEventMock = jest.fn().mockReturnValue(true);
const sendEventToSQSMock = jest.fn();
const loggerMock = jest.fn();

jest.mock("../createEvent", () => ({
  createEvent: (type: string, entity: object) => createEventMock(type, entity),
}));
jest.mock("../validateEvent", () => ({
  validateEvent: (event: object) => validateEventMock(event),
}));
jest.mock("../sendEventToSQS", () => ({
  sendEventToSQS: (event: object, queueUrl: string, options: object) =>
    sendEventToSQSMock(event, queueUrl, options),
}));
jest.mock("../logger", () => ({
  info: (content: string) => loggerMock(content),
}));

const newEvent = {
  component_id: "component_id",
  event_name: "AIS_EVENT_TRANSITION_APPLIED" as EventKey,
  event_timestamp_ms: Date.now(),
  timestamp: Date.now(),
};

describe("sendEventToSQS", () => {
  afterEach(() => {
    createEventMock.mockClear();
    validateEventMock.mockClear();
    sendEventToSQSMock.mockClear();
    loggerMock.mockClear();
  });

  it("should send a valid event to the given SQS URL (default client)", () => {
    sendToTXMA(newEvent.event_name, newEvent, "test.queue.url");
    expect(createEventMock).toHaveBeenCalledWith(
      newEvent.event_name,
      expect.objectContaining(newEvent),
    );
    expect(validateEventMock).toHaveBeenCalledWith(
      expect.objectContaining(newEvent),
    );
    expect(sendEventToSQSMock).toHaveBeenCalledWith(
      newEvent,
      "test.queue.url",
      undefined,
    );
    expect(loggerMock).not.toHaveBeenCalled();
  });

  it("should send a valid event to the given SQS URL (custom client)", () => {
    const mockSQSClient = {};

    const customSendFn = customSendToTXMA("alt.queue.url", {
      sqsClient: mockSQSClient as unknown as SQSClient,
    });
    customSendFn(newEvent.event_name, newEvent);

    expect(createEventMock).toHaveBeenCalledWith(
      newEvent.event_name,
      expect.objectContaining(newEvent),
    );
    expect(validateEventMock).toHaveBeenCalledWith(
      expect.objectContaining(newEvent),
    );
    expect(sendEventToSQSMock).toHaveBeenCalledWith(
      expect.objectContaining(newEvent),
      "alt.queue.url",
      { logParams: [], sqsClient: mockSQSClient },
    );
    expect(loggerMock).not.toHaveBeenCalled();
  });

  it("should still send an invalid event to the given SQS URL and log a warning", () => {
    validateEventMock.mockReturnValueOnce(false);
    sendToTXMA(newEvent.event_name, newEvent, "test.queue.url");

    expect(createEventMock).toHaveBeenCalledWith(
      newEvent.event_name,
      expect.objectContaining(newEvent),
    );
    expect(validateEventMock).toHaveBeenCalledWith(
      expect.objectContaining(newEvent),
    );
    expect(sendEventToSQSMock).toHaveBeenCalledWith(
      expect.objectContaining(newEvent),
      "test.queue.url",
      undefined,
    );
    expect(loggerMock).toHaveBeenCalledWith(
      expect.stringContaining("Invalid event created: "),
    );
  });
});
