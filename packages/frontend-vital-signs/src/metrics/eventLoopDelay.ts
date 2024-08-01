import { IntervalHistogram, monitorEventLoopDelay } from "perf_hooks";

export const trackEventLoopDelay = () => {
  let eventLoopDelayMonitor = monitorEventLoopDelay({ resolution: 10 });
  eventLoopDelayMonitor.enable();

  return {
    getEventLoopDelay() {
      const values: IntervalHistogram = JSON.parse(
        JSON.stringify(eventLoopDelayMonitor),
      );
      eventLoopDelayMonitor.disable();
      eventLoopDelayMonitor = monitorEventLoopDelay({ resolution: 10 });
      eventLoopDelayMonitor.enable();
      return values.mean / 1e6;
    },
    stop() {
      eventLoopDelayMonitor.disable();
    },
  };
};
