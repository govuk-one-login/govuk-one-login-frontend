import { monitorEventLoopDelay } from "perf_hooks";

export const trackEventLoopDelay = () => {
  let eventLoopDelayMonitor = monitorEventLoopDelay({ resolution: 10 });
  eventLoopDelayMonitor.enable();

  return {
    getEventLoopDelay() {
      eventLoopDelayMonitor.disable();
      const max = eventLoopDelayMonitor.max / 1e6;
      eventLoopDelayMonitor = monitorEventLoopDelay({ resolution: 10 });
      eventLoopDelayMonitor.enable();
      return max;
    },
    stop() {
      eventLoopDelayMonitor.disable();
    },
  };
};
