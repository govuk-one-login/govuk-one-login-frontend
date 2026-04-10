/* eslint-disable */
import { mostFrequentValuesInArrayOfDictionaries } from "./getMostFrequent";

describe("mostFrequentValuesInArrayOfDictionaries", () => {
  test("return an empty object in array is empty", () => {
    expect(
      mostFrequentValuesInArrayOfDictionaries([], ["key1", "key2"]),
    ).toEqual({});
  });

  test("return the most frequent value for a specific key", () => {
    const data = [
      { key1: "one", key2: "two" },
      { key1: "one", key2: "three" },
      { key1: "two", key2: "two" },
      { key1: "one", key2: "two" },
    ];

    expect(
      mostFrequentValuesInArrayOfDictionaries(data, ["key1", "key2"]),
    ).toEqual({
      key1: "one",
      key2: "two",
    });
  });

  test("check for objects where the key values are undefined", () => {
    const data = [{ key1: undefined }, { key2: undefined }];

    expect(mostFrequentValuesInArrayOfDictionaries(data, ["key1"])).toEqual({});
  });
});
