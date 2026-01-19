import { APIGatewayProxyEvent } from "aws-lambda";
import { getHeader } from "../getHeader";

describe("getHeader", () => {
  it("returns undefined if headers are undefined", () => {
    const header = getHeader({} as APIGatewayProxyEvent, "my-header");
    expect(header).toBeUndefined();
  });

  it("returns undefined if headers are empty", () => {
    const header = getHeader(
      { headers: {} } as APIGatewayProxyEvent,
      "my-header",
    );
    expect(header).toBeUndefined();
  });

  it("returns undefined if there is no matching header", () => {
    const header = getHeader(
      {
        headers: { "another-header": "some-value" } as Record<string, string>,
      } as APIGatewayProxyEvent,
      "my-header",
    );
    expect(header).toBeUndefined();
  });

  it("returns the correct header if it exists", () => {
    const header = getHeader(
      {
        headers: {
          "my-header": "correct-value",
          "another-header": "some-value",
        } as Record<string, string>,
      } as APIGatewayProxyEvent,
      "my-header",
    );
    expect(header).toEqual("correct-value");
  });
});
