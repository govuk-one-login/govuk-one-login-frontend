import { ephemeralIFrame, wait } from "./ephemeralIFrame";

jest.useFakeTimers();

describe("creating an iframe, execute the callback, and remove the iframe", () => {
  it("call and set the iframe", async () => {
    const callback = jest.fn();

    const promise = ephemeralIFrame(callback);

    jest.advanceTimersByTime(5000);
    await promise;

    expect(callback).toHaveBeenCalled();

    const iframe = document.querySelector("iframe");
    expect(iframe).toBeNull();
  });

  it("cleanup of the iframe", async () => {
    const callback = jest.fn();

    const promise = ephemeralIFrame(callback);

    jest.advanceTimersByTime(0);
    await promise;

    const iframe = document.querySelector("iframe");
    expect(iframe).toBeNull();
  });
});

describe("wait", () => {
  it("should resolve the promises of iframe callback after the duration", async () => {
    const mockCallback = jest.fn();

    const promise = wait(3000).then(mockCallback);

    jest.advanceTimersByTime(3000);

    await promise;

    expect(mockCallback).toHaveBeenCalled();
  });
});
