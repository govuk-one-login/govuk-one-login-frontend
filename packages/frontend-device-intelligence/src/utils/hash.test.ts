import { hash } from "./hash";

describe("hash", () => {
  it("should hash data", async () => {
    expect(hash("dummy-text", 0)).toBe("b726a78bd3eef075374fce5881554bb7");
  });
});
