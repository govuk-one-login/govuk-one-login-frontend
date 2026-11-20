// Unit tests with a fake histogram, so behaviour is deterministic.
// perf_hooks.monitorEventLoopDelay is replaced before index.js is loaded,
// because index.js destructures it at require time.
// describe / test / expect / vi are globals (globals: true).

const perfHooks = require("node:perf_hooks");

const realMonitor = perfHooks.monitorEventLoopDelay;
const fake = {
  max: 0,
  enable: vi.fn(),
  reset: vi.fn(),
};
perfHooks.monitorEventLoopDelay = vi.fn(() => fake);
const overloadProtection = require("..");
perfHooks.monitorEventLoopDelay = realMonitor;

const setLagMs = (n) => {
  fake.max = n * 1e6; // ms -> ns
};

const fakeRes = () => {
  const res = {};
  res.status = vi.fn(() => res);
  res.json = vi.fn(() => res);
  return res;
};

describe("overloadProtection", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    fake.enable.mockClear();
    fake.reset.mockClear();
    setLagMs(0);
  });
  afterEach(() => vi.useRealTimers());

  test("enables the histogram", () => {
    overloadProtection();
    expect(fake.enable).toHaveBeenCalledOnce();
  });

  test("calls next() when the event loop is healthy", () => {
    const middleware = overloadProtection();
    const res = fakeRes();
    const next = vi.fn();
    setLagMs(20);

    middleware({}, res, next);

    expect(next).toHaveBeenCalledOnce();
    expect(res.status).not.toHaveBeenCalled();
  });

  test("calls next() before the histogram has any samples", () => {
    const middleware = overloadProtection();
    const next = vi.fn();
    setLagMs(0); // an empty histogram reports max as 0

    middleware({}, fakeRes(), next);

    expect(next).toHaveBeenCalledOnce();
  });

  test("responds 503 with a JSON body when max lag exceeds 200ms by default", () => {
    const middleware = overloadProtection();
    const res = fakeRes();
    const next = vi.fn();
    setLagMs(201);

    middleware({}, res, next);

    expect(res.status).toHaveBeenCalledWith(503);
    expect(res.json).toHaveBeenCalledWith({ message: "Service unavailable" });
    expect(next).not.toHaveBeenCalled();
  });

  test("does not shed at exactly the threshold", () => {
    const middleware = overloadProtection();
    const next = vi.fn();
    setLagMs(200);

    middleware({}, fakeRes(), next);

    expect(next).toHaveBeenCalledOnce();
  });

  test("respects a custom maxEventLoopDelay", () => {
    const middleware = overloadProtection({ maxEventLoopDelay: 50 });
    const res = fakeRes();
    setLagMs(60);

    middleware({}, res, vi.fn());

    expect(res.status).toHaveBeenCalledWith(503);
  });

  test("resets the histogram every second", () => {
    overloadProtection();

    vi.advanceTimersByTime(999);
    expect(fake.reset).not.toHaveBeenCalled();
    vi.advanceTimersByTime(1);
    expect(fake.reset).toHaveBeenCalledTimes(1);
    vi.advanceTimersByTime(2000);
    expect(fake.reset).toHaveBeenCalledTimes(3);
  });
});
