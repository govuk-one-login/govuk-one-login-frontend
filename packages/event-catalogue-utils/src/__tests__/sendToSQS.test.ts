import { sendAuditEvent } from "../sendEventToSQS";

const mockSend = jest.fn();

jest.mock("@aws-sdk/client-sqs", () => ({
  ...jest.requireActual("@aws-sdk/client-sqs"),
  SQSClient: jest.fn(() => ({ send: mockSend })),
}));

describe("sendEventToSQS", () => {
  beforeEach(() => {
    mockSend.mockResolvedValue({
      MessageId: "test-id",
      $metadata: { httpStatusCode: 200 },
    });
  });

  it("should send an event to the given SQS URL", () => {
    const newEvent = {
      component_id: "component_id",
      event_name: "AIS_EVENT_TRANSITION_APPLIED",
      event_timestamp_ms: Date.now(),
      timestamp: Date.now(),
    };

    sendAuditEvent("test.queue.url", newEvent);
    expect(mockSend).toHaveBeenCalledWith(
      expect.objectContaining({
        input: expect.objectContaining({
          QueueUrl: "test.queue.url",
          MessageBody: expect.stringContaining(
            '"component_id":"component_id","event_name":"AIS_EVENT_TRANSITION_APPLIED"',
          ),
        }),
      }),
    );
  });
});
