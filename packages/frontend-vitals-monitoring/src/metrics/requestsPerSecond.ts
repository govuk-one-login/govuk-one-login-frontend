import http from "http";
import https from "https";

let requestsInWindowDynamic = 0;
let requestsInWindowStatic = 0;

export const trackRequestsPerSecond = (
  server: http.Server | https.Server,
  staticPaths: RegExp[],
) => {
  server.on("request", (req) => {
    if (staticPaths.some((path) => path.test(req.url!))) {
      requestsInWindowStatic++;
    } else {
      requestsInWindowDynamic++;
    }
  });
};

export function getRequestsPerSecondValues(interval: number) {
  const intervalSeconds = interval / 1000;

  const value = {
    dynamic: requestsInWindowDynamic / intervalSeconds,
    static: requestsInWindowStatic / intervalSeconds,
  };

  requestsInWindowDynamic = 0;
  requestsInWindowStatic = 0;

  return value;
}
