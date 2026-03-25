import { ephemeralIFrame, wait } from "./ephemeralIFrame";

vi.useFakeTimers();

describe("creating an iframe, execute the callback, and remove the iframe", () => {
  it("call and set the iframe", async () => {
    const callback = vi.fn();

    const promise = ephemeralIFrame(callback);

    vi.advanceTimersByTime(5000);
    await promise;

    expect(callback).toHaveBeenCalled();

    const iframe = document.querySelector("iframe");
    expect(iframe).toBeNull();
  });

  it("cleanup of the iframe", async () => {
    const callback = vi.fn();

    const promise = ephemeralIFrame(callback);

    vi.advanceTimersByTime(0);
    await promise;

    const iframe = document.querySelector("iframe");
    expect(iframe).toBeNull();
  });
});

describe("wait", () => {
  it("should resolve the promises of iframe callback after the duration", async () => {
    const mockCallback = vi.fn();

    const promise = wait(3000).then(mockCallback);

    vi.advanceTimersByTime(3000);

    await promise;

    expect(mockCallback).toHaveBeenCalled();
  });
});
