import { ephemeralIFrame } from "./ephemeralIFrame";

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
