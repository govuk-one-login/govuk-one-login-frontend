/* eslint-disable */
import { delay, raceAll, raceAllPerformance } from "./raceAll";

vi.useFakeTimers();

describe("Utils for the delay raceAll condition", () => {
  describe("delay", () => {
    it("should resolve after the specified time", async () => {
      const val = "test";
      const delayTime = 1000;
      const delayedPromise = delay(delayTime, val);

      vi.advanceTimersByTime(delayTime);

      expect(await delayedPromise).toBe(val);
    });
  });
});
