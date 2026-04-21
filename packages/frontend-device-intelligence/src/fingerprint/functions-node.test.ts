/**
 * @vitest-environment node
 */

import { setFingerprintCookie } from "./functions";
import logger from "../logger";

describe("setFingerprintCookie()", () => {
  beforeEach(() => {
    vi.spyOn(logger, "warn").mockImplementation(() => {});
  });

  test("should log a warning if run on the server side", async () => {
    await setFingerprintCookie();

    expect(logger.warn).toHaveBeenCalledWith(
      "fingerprint cookie logic should only run on the client side",
    );
  });
});
