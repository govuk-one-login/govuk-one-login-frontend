import http from "http";

let maxConcurrentConnections = 0;

export const calculateMaxConcurrentConnections = (server: http.Server) => {
  // Check the number of active connections
  setInterval(() => {
    server.getConnections((err, count) => {
      if (err) {
        console.error("Error getting connections:", err);
      } else if (count > maxConcurrentConnections) {
        maxConcurrentConnections = count;
      }
    });
  }, 1000);
};

// Export a function to get the max concurrent connections
export const getMaxConcurrentConnections = () => {
  const connections = maxConcurrentConnections;
  maxConcurrentConnections = 0;
  return connections;
};
