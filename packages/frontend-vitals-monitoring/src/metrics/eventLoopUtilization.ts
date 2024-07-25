import { performance } from "perf_hooks";
const { eventLoopUtilization } = performance;

export const trackEventLoopUtilization = () => {
  let lastUtilization = eventLoopUtilization();

  return function getEventLoopUtilization() {
    const newUtilisation = eventLoopUtilization();
    const utilization = eventLoopUtilization(newUtilisation, lastUtilization);
    lastUtilization = newUtilisation;
    return utilization;
  };
};
