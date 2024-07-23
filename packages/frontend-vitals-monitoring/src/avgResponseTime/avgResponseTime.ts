import http from "http";

let totalStaticResponseTime = 0;
let totalDynamicResponseTime = 0;
let staticRequestCount = 0;
let dynamicRequestCount = 0;

export const calculateAvgResponseTime = (
  server: http.Server,
  staticPaths: RegExp[],
) => {
  server.on("request", (req, res) => {
    const startTime = Date.now();

    res.on("finish", () => {
      const responseTime = Date.now() - startTime;

      if (staticPaths.some((path) => path.test(req.url!))) {
        totalStaticResponseTime += responseTime;
        staticRequestCount++;
      } else {
        totalDynamicResponseTime += responseTime;
        dynamicRequestCount++;
      }
    });
  });
};

// Getters for average response times
export const getAvgStaticResponseTime = () => {
  if (staticRequestCount === 0) {
    return null;
  }
  const avgStaticResponseTime = totalStaticResponseTime / staticRequestCount;
  totalStaticResponseTime = 0;
  staticRequestCount = 0;

  return avgStaticResponseTime;
};
export const getAvgDynamicResponseTime = () => {
  if (dynamicRequestCount === 0) {
    return null;
  }
  const avgDynamicResponseTime = totalDynamicResponseTime / dynamicRequestCount;
  totalDynamicResponseTime = 0;
  dynamicRequestCount = 0;
  return avgDynamicResponseTime;
};
