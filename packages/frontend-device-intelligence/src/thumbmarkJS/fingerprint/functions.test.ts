/* eslint-disable */
import { componentInterface } from "../factory";
import {
  getFingerprint,
  getFingerprintData,
  getFingerprintPerformance,
  filterFingerprintData,
} from "./functions";
import { hash } from "../utils/hash";

jest.mock("../factory", () => ({
  getComponentPromises: jest.fn(() => ({
    one: Promise.resolve("1"),
    two: Promise.resolve(2),
    three: Promise.resolve({ a: true, b: false }),
  })),
  timeoutInstance: {},
}));

jest.mock("../../../package.json", () => ({
  version: "1.2.3",
}));

jest.mock("../utils/hash", () => ({
  hash: jest.fn((data) => "hashed_${data}"),
}));

const test_components: componentInterface = {
  one: "1",
  two: 2,
  three: { a: true, b: false },
};

describe("component filtering tests", () => {
  test("excluding top level works", () => {
    expect(filterFingerprintData(test_components, ["one"], [])).toMatchObject({
      two: 2,
      three: { a: true, b: false },
    });
  });
  test("including top level works", () => {
    expect(
      filterFingerprintData(test_components, [], ["one", "two"]),
    ).toMatchObject({
      one: "1",
      two: 2,
    });
  });
  test("excluding low-level works", () => {
    expect(
      filterFingerprintData(test_components, ["two", "three.a"], []),
    ).toMatchObject({
      one: "1",
      three: { b: false },
    });
  });
  test("including low-level works", () => {
    expect(
      filterFingerprintData(test_components, [], ["one", "three.b"]),
    ).toMatchObject({
      one: "1",
      three: { b: false },
    });
  });

  test("filtering should return empty object if all elements are excluded", () => {
    const result = filterFingerprintData(
      test_components,
      ["one", "two", "three"],
      [],
    );
    expect(result).toMatchObject({});
  });

  test("filtering should return complete object if no elements are specified", () => {
    const result = filterFingerprintData(test_components, [], []);
    expect(result).toMatchObject(test_components);
  });
});
