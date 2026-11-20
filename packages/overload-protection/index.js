const { monitorEventLoopDelay } = require("node:perf_hooks");

const overloadProtection = ({ maxEventLoopDelay = 200 } = {}) => {
  const histogram = monitorEventLoopDelay({ resolution: 20 });
  histogram.enable();
  // reset every second so max reflects recent lag, not all-time lag
  setInterval(() => histogram.reset(), 1000).unref();

  return (_req, res, next) => {
    // max is in nanoseconds, convert to ms
    if (histogram.max / 1e6 > maxEventLoopDelay) {
      return res.status(503).json({ message: "Service unavailable" });
    }
    next();
  };
};

module.exports = overloadProtection;
