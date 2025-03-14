import { getMostFrequent } from "./commonPixels";

describe("getMostFrequent", () => {
  test("returns the most frequent number in an array", () => {
    expect(getMostFrequent([1, 2, 2, 3, 3, 3])).toBe(3);
  });

  test("handles an empty array as the most frequent number", () => {
    expect(getMostFrequent([])).toBe(0);
  });

  test("handles an array with only one unique number", () => {
    expect(getMostFrequent([2, 2, 2])).toBe(2);
  });

  test("handles an array with zeros", () => {
    expect(getMostFrequent([0, 0, 0, 0, 1])).toBe(0);
  });

  test("handles an array with mixed numbers", () => {
    expect(getMostFrequent([0, -1, -1, 2, 2, 2, 2, 2, 0, 0])).toBe(2);
  });
});
