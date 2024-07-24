import http from "http";

let maxConcurrentConnections = 0;

export const calculateMaxConcurrentConnections = (server: http.Server) => {
  // Check the number of active connections
  server.getConnections((err, count) => {
    if (err) {
      console.error("Error getting connections:", err);
    } else {
      console.log(`Number of active connections: ${count}`);
      maxConcurrentConnections = count;
    }
  });
};

// Export a function to get the max concurrent connections
export const getMaxConcurrentConnections = () => {
  const connections = maxConcurrentConnections;
  maxConcurrentConnections = 0;
  return connections;
};
