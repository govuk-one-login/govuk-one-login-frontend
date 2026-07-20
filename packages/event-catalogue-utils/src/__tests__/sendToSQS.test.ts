import { sendEventToSQS } from "../sendEventToSQS";

const mockSend = vi.fn();

vi.mock("@aws-sdk/client-sqs", async () => ({
  ...(await vi.importActual("@aws-sdk/client-sqs")),
  SQSClient: vi.fn(
    class {
      send = mockSend;
    },
  ),
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

    sendEventToSQS(newEvent, "test.queue.url");
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
