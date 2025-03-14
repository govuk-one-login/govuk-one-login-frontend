/* eslint-disable */
import { setOption, options, optionsInterface } from "./options";

describe("setOption", () => {
  beforeEach(() => {
    options.exclude = [];
    options.include = [];
    options.webgl_runs = undefined;
    options.canvas_runs = undefined;
    options.permissions_to_check = undefined;
    options.retries = undefined;
    options.timeout = undefined;
    options.logging = true;
  });

  test('should throw an error if "include" is set to an array with non string value', () => {
    expect(() => setOption("include", ["valid", 123] as any)).toThrow(
      "The value of the include, exclude and permissions_to_check must be an array of strings",
    );
  });

  test('should correctly set the "exclude" option with vaild array of string values', () => {
    setOption("exclude", ["exclude1", "exclude2"]);
    expect(options.exclude).toEqual(["exclude1", "exclude2"]);
  });

  test('should correctly set the "timeout" option with a number value', () => {
    setOption("timeout", 5000);
    expect(options.timeout).toBe(5000);
  });

  test('should throw an error if "timeout" is set to a non-number value', () => {
    expect(() => setOption("timeout", "5000ms" as any)).toThrow(
      "The value of retries must be a number",
    );
  });

  test('should correctly set the "logging" option with a boolean value', () => {
    setOption("logging", false);
    expect(options.logging).toBe(false);
  });

  test("should throw an error if an unknown option is provided", () => {
    expect(() =>
      setOption("invalidOption" as keyof optionsInterface, "value" as any),
    ).toThrow("Unknown option invalidOption");
  });
});
