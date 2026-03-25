// @vitest-environment node

import { hash } from "./hash";

describe("hash", () => {
  it("should hash data", async () => {
    expect(hash("dummy-text", 0)).toBe("6d2b9042d4b6c7593aac61ab0c7ffb1a");
  });
});
