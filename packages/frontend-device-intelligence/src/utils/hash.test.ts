import { hash } from "./hash";

function mockTextEncoder() {}
mockTextEncoder.prototype.encode = (str: string) => {
  const buf = new ArrayBuffer(str.length * 2); // 2 bytes for each char
  const bufView = new Uint16Array(buf);
  for (let i = 0, strLen = str.length; i < strLen; i++) {
    bufView[i] = str.charCodeAt(i);
  }
  return { buffer: buf };
};

describe("hash", () => {
  beforeAll(() => {
    Object.assign(global, { TextEncoder: mockTextEncoder });
  });

  it("should hash data", async () => {
    expect(hash("dummy-text", 0)).toBe("b726a78bd3eef075374fce5881554bb7");
  });
});
