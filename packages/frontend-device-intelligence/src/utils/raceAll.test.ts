/* eslint-disable */
import { delay, raceAll, raceAllPerformance } from "./raceAll";

jest.useFakeTimers();

describe("Utils for the delay raceAll condition", () => {
  describe("delay", () => {
    it("should resolve after the specified time", async () => {
      const val = "test";
      const delayTime = 1000;
      const delayedPromise = delay(delayTime, val);

      jest.advanceTimersByTime(delayTime);

      expect(await delayedPromise).toBe(val);
    });
  });
});
