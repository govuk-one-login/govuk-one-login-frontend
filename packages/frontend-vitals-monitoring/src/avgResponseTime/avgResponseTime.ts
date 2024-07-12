import http from "http";

let totalStaticResponseTime = 0;
let totalDynamicResponseTime = 0;
let staticRequestCount = 0;
let dynamicRequestCount = 0;
let avgStaticResponseTime = 0;
let avgDynamicResponseTime = 0;

export const calculateAvgResponseTime = (server: http.Server) => {
  server.on("request", (req, res) => {
    const startTime = Date.now();

    res.on("finish", () => {
      const responseTime = Date.now() - startTime;
      if (
        req.url?.match(
          /\.(html|css|js|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|otf|eot|mp4|mp3|wav|webm|ogg)$/,
        )
      ) {
        totalStaticResponseTime += responseTime;
        staticRequestCount++;
        avgStaticResponseTime = totalStaticResponseTime / staticRequestCount;
      } else {
        totalDynamicResponseTime += responseTime;
        dynamicRequestCount++;
        avgDynamicResponseTime = totalDynamicResponseTime / dynamicRequestCount;
      }
    });
  });
};

// Getters for average response times
export const getAvgStaticResponseTime = () => avgStaticResponseTime;
export const getAvgDynamicResponseTime = () => avgDynamicResponseTime;
