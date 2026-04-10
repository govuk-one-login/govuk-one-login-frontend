import { raceAll } from "./raceAll";

describe("raceAll", () => {
  it("should resolve after the specified time", async () => {
    const fastPromise = new Promise((resolve) => {
      setTimeout(() => resolve("fast-promise"), 100);
    });

    const slowPromise = new Promise((resolve) => {
      setTimeout(() => resolve("slow-promise"), 500);
    });

    const result = await raceAll(
      [fastPromise, slowPromise],
      300,
      "timeout-hit",
    );

    expect(result).toStrictEqual(["fast-promise", "timeout-hit"]);
  });
});
