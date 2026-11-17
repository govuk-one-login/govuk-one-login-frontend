// Sanity check against the REAL node:perf_hooks histogram (no mocking).
// Blocks the event loop and asserts the middleware sheds, then recovers.
// describe / test / expect / vi are globals (globals: true).

const overloadProtection = require("..");

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const block = (ms) => {
  const start = Date.now();
  while (Date.now() - start < ms) {
    /* block the event loop */
  }
};

// Returns true if the request was shed (503), false if it was passed on.
const isShed = (middleware) => {
  let status;
  const res = {
    status(code) {
      status = code;
      return res;
    },
    json: () => res,
  };
  middleware({}, res, () => {});
  return status === 503;
};

describe("overloadProtection (real histogram)", () => {
  test("sheds while the event loop is lagging, then recovers", async () => {
    const middleware = overloadProtection();

    // Sustained overload: back-to-back 300ms blocks, checking after each one.
    let shed = 0;
    for (let i = 0; i < 10; i++) {
      block(300);
      await sleep(5);
      if (isShed(middleware)) shed++;
    }
    expect(shed).toBeGreaterThan(0);

    // Healthy again: after more than one reset window, nothing is shed.
    await sleep(2500);
    for (let i = 0; i < 5; i++) {
      expect(isShed(middleware)).toBe(false);
      await sleep(50);
    }
  }, 15000);
});
