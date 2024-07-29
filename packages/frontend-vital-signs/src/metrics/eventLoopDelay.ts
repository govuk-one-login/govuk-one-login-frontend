import { monitorEventLoopDelay } from "perf_hooks";

export const trackEventLoopDelay = () => {
  const eventLoopDelayMonitor = monitorEventLoopDelay({ resolution: 10 });
  eventLoopDelayMonitor.enable();

  return {
    getEventLoopDelay() {
      if (!isNaN(eventLoopDelayMonitor.mean)) {
        return eventLoopDelayMonitor.mean / 1e6;
      } else {
        return 0;
      }
    },
    stop() {
      eventLoopDelayMonitor.disable();
    },
  };
};
