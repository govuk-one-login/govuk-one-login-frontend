/**
 * Minimal HTTP harness for k6 performance testing of validateEvent.
 * Schemas are precompiled at startup (via the updated validateEvent module).
 *
 * Usage: node src/perf/harness.js
 */
import { createServer } from "node:http";
import { validateEvent } from "../../build/esm/index.js";

const PORT = 3001;

const server = createServer((req, res) => {
  if (req.method !== "POST" || req.url !== "/validate") {
    res.writeHead(404).end();
    return;
  }

  let body = "";
  req.on("data", (chunk) => (body += chunk));
  req.on("end", () => {
    try {
      const event = JSON.parse(body);
      const valid = validateEvent(event);
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ valid }));
    } catch {
      res.writeHead(400).end();
    }
  });
});

server.listen(PORT, () => {
  console.log(`Harness listening on http://localhost:${PORT}`);
});
