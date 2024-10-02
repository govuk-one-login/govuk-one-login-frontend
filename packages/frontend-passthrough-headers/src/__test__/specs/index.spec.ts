import { type Request } from "express";
import { createPersonalDataHeaders } from "../../index";
import { logger } from "../../utils/logger";
import { APIGatewayProxyEvent } from "aws-lambda";

const MOCK_CLOUDFRONT_VIEWER_IPV4 = "198.51.100.10:46532";
const MOCK_CLOUDFRONT_VIEWER_IPV6 = "[2001:db8:cafe::17]:46532";
const MOCK_FORWARDED_IPV4 =
  'for=198.51.100.11, for="[2002:db8:cafe::17]:46532"';
const MOCK_FORWARDED_IPV6 =
  'for="[2003:db8:cafe::17]:46532", for=198.51.100.12';
const MOCK_X_FORWARDED_FOR_IPV4 = "198.51.100.13, 2004:db8:cafe::17";
const MOCK_X_FORWARDED_FOR_IPV6 = "2005:db8:cafe::17, 198.51.100.13";

describe("createPersonalDataHeaders", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe("handle txma-audit-encoded header", () => {
    it("should return an object with the txma-audit-encoded header if there is one present - lower case", () => {
      const headers = createPersonalDataHeaders("https://account.gov.uk", {
        headers: { ["txma-audit-encoded"]: "dummy-txma-header" },
      } as unknown as Request);

      expect(headers).toEqual({
        ["txma-audit-encoded"]: "dummy-txma-header",
      });
    });

    it("should return an object with the txma-audit-encoded header if there is one present - upper case", () => {
      const headers = createPersonalDataHeaders("https://account.gov.uk", {
        headers: { ["Txma-Audit-Encoded"]: "dummy-txma-header" },
      } as unknown as Request);

      expect(headers).toEqual({
        ["txma-audit-encoded"]: "dummy-txma-header",
      });
    });

    it("should return an empty object if there is no txma-audit-encoded present", () => {
      const headers = createPersonalDataHeaders("https://account.gov.uk", {
        headers: {},
      } as unknown as Request);

      expect(headers).toEqual({});
    });
  });

  describe("handle x-forwarded-for header", () => {
    describe("handle 'cloudfront-viewer-address' input", () => {
      it("should prioritise cloudfront and extract an IPv4 from the 'cloudfront-viewer-address' header - lower case", () => {
        const headers = createPersonalDataHeaders("https://account.gov.uk", {
          headers: {
            "cloudfront-viewer-address": MOCK_CLOUDFRONT_VIEWER_IPV4,
            forwarded: MOCK_FORWARDED_IPV4,
            "x-forwarded-for": MOCK_X_FORWARDED_FOR_IPV4,
          },
          ip: "198.51.100.13",
        } as unknown as Request);

        expect(headers).toEqual({
          "x-forwarded-for": "198.51.100.10",
        });
      });

      it("should prioritise cloudfront and extract an IPv4 from the 'cloudfront-viewer-address' header - upper case", () => {
        const headers = createPersonalDataHeaders("https://account.gov.uk", {
          headers: {
            "Cloudfront-Viewer-Address": MOCK_CLOUDFRONT_VIEWER_IPV4,
            Forwarded: MOCK_FORWARDED_IPV4,
            "X-Forwarded-For": MOCK_X_FORWARDED_FOR_IPV4,
          },
          ip: "198.51.100.13",
        } as unknown as Request);

        expect(headers).toEqual({
          "x-forwarded-for": "198.51.100.10",
        });
      });

      it("should prioritise cloudfront and extract an IPv6 from the 'cloudfront-viewer-address' header - lower case", () => {
        const headers = createPersonalDataHeaders("https://account.gov.uk", {
          headers: {
            "cloudfront-viewer-address": MOCK_CLOUDFRONT_VIEWER_IPV6,
            forwarded: MOCK_FORWARDED_IPV4,
            "x-forwarded-for": MOCK_X_FORWARDED_FOR_IPV4,
          },
          ip: "198.51.100.13",
        } as unknown as Request);

        expect(headers).toEqual({
          "x-forwarded-for": "2001:db8:cafe::17",
        });
      });

      it("should prioritise cloudfront and extract an IPv6 from the 'cloudfront-viewer-address' header - upper case", () => {
        const headers = createPersonalDataHeaders("https://account.gov.uk", {
          headers: {
            "Cloudfront-Viewer-Address": MOCK_CLOUDFRONT_VIEWER_IPV6,
            Forwarded: MOCK_FORWARDED_IPV4,
            "X-Forwarded-For": MOCK_X_FORWARDED_FOR_IPV4,
          },
          ip: "198.51.100.13",
        } as unknown as Request);

        expect(headers).toEqual({
          "x-forwarded-for": "2001:db8:cafe::17",
        });
      });

      it("should log a warning and not return the header on an invalid 'cloudfront-viewer-address' header - lower case", () => {
        const spyLogger = jest.spyOn(logger, "warn");
        const headers = createPersonalDataHeaders("https://account.gov.uk", {
          headers: {
            "cloudfront-viewer-address": "fgfgn4t428fcxcz'][]/.",
            forwarded: MOCK_FORWARDED_IPV4,
            "x-forwarded-for": MOCK_X_FORWARDED_FOR_IPV4,
          },
          ip: "198.51.100.13",
        } as unknown as Request);
        expect(spyLogger).toHaveBeenCalledWith(
          'Request received with invalid content in "cloudfront-viewer-address" header.',
        );
        expect(headers).toEqual({});
      });

      it("should log a warning and not return the header on an invalid 'cloudfront-viewer-address' header - upper case", () => {
        const spyLogger = jest.spyOn(logger, "warn");
        const headers = createPersonalDataHeaders("https://account.gov.uk", {
          headers: {
            "Cloudfront-Viewer-Address": "fgfgn4t428fcxcz'][]/.",
            Forwarded: MOCK_FORWARDED_IPV4,
            "X-Forwarded-For": MOCK_X_FORWARDED_FOR_IPV4,
          },
          ip: "198.51.100.13",
        } as unknown as Request);
        expect(spyLogger).toHaveBeenCalledWith(
          'Request received with invalid content in "cloudfront-viewer-address" header.',
        );
        expect(headers).toEqual({});
      });
    });

    describe("handle 'forwarded' input", () => {
      it("should fall back to forwarded and extract an IPv4 from the 'forwarded' header - lower case", () => {
        const headers = createPersonalDataHeaders("https://account.gov.uk", {
          headers: {
            forwarded: MOCK_FORWARDED_IPV4,
            "x-forwarded-for": MOCK_X_FORWARDED_FOR_IPV4,
          },
          ip: "198.51.100.13",
        } as unknown as Request);

        expect(headers).toEqual({
          "x-forwarded-for": "198.51.100.11",
        });
      });

      it("should fall back to forwarded and extract an IPv4 from the 'forwarded' header - upper case", () => {
        const headers = createPersonalDataHeaders("https://account.gov.uk", {
          headers: {
            Forwarded: MOCK_FORWARDED_IPV4,
            "X-Forwarded-For": MOCK_X_FORWARDED_FOR_IPV4,
          },
          ip: "198.51.100.13",
        } as unknown as Request);

        expect(headers).toEqual({
          "x-forwarded-for": "198.51.100.11",
        });
      });

      it("should fall back to forwarded and extract an IPv6 from the 'forwarded' header - lower case", () => {
        const headers = createPersonalDataHeaders("https://account.gov.uk", {
          headers: {
            forwarded: MOCK_FORWARDED_IPV6,
            "x-forwarded-for": MOCK_X_FORWARDED_FOR_IPV4,
          },
          ip: "198.51.100.13",
        } as unknown as Request);

        expect(headers).toEqual({
          "x-forwarded-for": "2003:db8:cafe::17",
        });
      });

      it("should fall back to forwarded and extract an IPv6 from the 'forwarded' header - upper case", () => {
        const headers = createPersonalDataHeaders("https://account.gov.uk", {
          headers: {
            Forwarded: MOCK_FORWARDED_IPV6,
            "X-Forwarded-For": MOCK_X_FORWARDED_FOR_IPV4,
          },
          ip: "198.51.100.13",
        } as unknown as Request);

        expect(headers).toEqual({
          "x-forwarded-for": "2003:db8:cafe::17",
        });
      });

      it("should log a warning and not return a header on an invalid 'forwarded' header - lower case", () => {
        const spyLogger = jest.spyOn(logger, "warn");
        const headers = createPersonalDataHeaders("https://account.gov.uk", {
          headers: {
            forwarded: "fgfgn4t428fcxcz'][]/.",
            "x-forwarded-for": MOCK_X_FORWARDED_FOR_IPV4,
          },
          ip: "198.51.100.13",
        } as unknown as Request);
        expect(spyLogger).toHaveBeenCalledWith(
          'Request received with invalid content in "forwarded" header.',
        );
        expect(headers).toEqual({});
      });

      it("should log a warning and not return a header on an invalid 'forwarded' header - upper case", () => {
        const spyLogger = jest.spyOn(logger, "warn");
        const headers = createPersonalDataHeaders("https://account.gov.uk", {
          headers: {
            Forwarded: "fgfgn4t428fcxcz'][]/.",
            "X-Forwarded-For": MOCK_X_FORWARDED_FOR_IPV4,
          },
          ip: "198.51.100.13",
        } as unknown as Request);
        expect(spyLogger).toHaveBeenCalledWith(
          'Request received with invalid content in "forwarded" header.',
        );
        expect(headers).toEqual({});
      });
    });

    describe("handle 'x-forwarded-for' input", () => {
      it("should fall back to x-forwarded-for and extract an IPv4 from the 'x-forwarded-for' header - lower case", () => {
        const headers = createPersonalDataHeaders("https://account.gov.uk", {
          headers: {
            "x-forwarded-for": MOCK_X_FORWARDED_FOR_IPV4,
          },
          ip: "198.51.100.13",
        } as unknown as Request);

        expect(headers).toEqual({
          "x-forwarded-for": "198.51.100.13",
        });
      });

      it("should fall back to x-forwarded-for and extract an IPv4 from the 'x-forwarded-for' header - upper case", () => {
        const headers = createPersonalDataHeaders("https://account.gov.uk", {
          headers: {
            "X-Forwarded-For": MOCK_X_FORWARDED_FOR_IPV4,
          },
          ip: "198.51.100.13",
        } as unknown as Request);

        expect(headers).toEqual({
          "x-forwarded-for": "198.51.100.13",
        });
      });

      it("should fall back to x-forwarded-for and extract an IPv4 from ApiGatewayProxyEvent request - lower case", () => {
        const headers = createPersonalDataHeaders("https://account.gov.uk", {
          headers: {
            "x-forwarded-for": MOCK_X_FORWARDED_FOR_IPV4,
          },
          requestContext: {
            identity: {
              sourceIp: "198.51.100.13",
            },
          },
        } as unknown as APIGatewayProxyEvent);

        expect(headers).toEqual({
          "x-forwarded-for": "198.51.100.13",
        });
      });

      it("should fall back to x-forwarded-for and extract an IPv4 from ApiGatewayProxyEvent request - upper case", () => {
        const headers = createPersonalDataHeaders("https://account.gov.uk", {
          headers: {
            "X-Forwarded-For": MOCK_X_FORWARDED_FOR_IPV4,
          },
          requestContext: {
            identity: {
              sourceIp: "198.51.100.13",
            },
          },
        } as unknown as APIGatewayProxyEvent);

        expect(headers).toEqual({
          "x-forwarded-for": "198.51.100.13",
        });
      });

      it("should fall back to x-forwarded-for and extract an IPv6 from the 'x-forwarded-for' header - lower case", () => {
        const headers = createPersonalDataHeaders("https://account.gov.uk", {
          headers: {
            "x-forwarded-for": MOCK_X_FORWARDED_FOR_IPV6,
          },
          ip: "2005:db8:cafe::17",
        } as unknown as Request);

        expect(headers).toEqual({
          "x-forwarded-for": "2005:db8:cafe::17",
        });
      });

      it("should fall back to x-forwarded-for and extract an IPv6 from the 'x-forwarded-for' header - upper case", () => {
        const headers = createPersonalDataHeaders("https://account.gov.uk", {
          headers: {
            "X-Forwarded-For": MOCK_X_FORWARDED_FOR_IPV6,
          },
          ip: "2005:db8:cafe::17",
        } as unknown as Request);

        expect(headers).toEqual({
          "x-forwarded-for": "2005:db8:cafe::17",
        });
      });

      it("should fallback through headers which have empty content - lower case", () => {
        const headers = createPersonalDataHeaders("https://account.gov.uk", {
          headers: {
            "cloudfront-viewer-address": "",
            forwarded: MOCK_FORWARDED_IPV4,
            "x-forwarded-for": MOCK_X_FORWARDED_FOR_IPV4,
          },
          ip: "198.51.100.13",
        } as unknown as Request);

        expect(headers).toEqual({
          "x-forwarded-for": "198.51.100.11",
        });
      });

      it("should fallback through headers which have empty content - upper case", () => {
        const headers = createPersonalDataHeaders("https://account.gov.uk", {
          headers: {
            "Cloudfront-Viewer-Address": "",
            Forwarded: MOCK_FORWARDED_IPV4,
            "X-Forwarded-For": MOCK_X_FORWARDED_FOR_IPV4,
          },
          ip: "198.51.100.13",
        } as unknown as Request);

        expect(headers).toEqual({
          "x-forwarded-for": "198.51.100.11",
        });
      });

      it("should return null if none of the headers are included", () => {
        const headers = createPersonalDataHeaders("https://account.gov.uk", {
          headers: {},
        } as unknown as Request);

        expect(headers).toEqual({});
      });
    });
  });
});
