import express from "express";
import { frontendVitalSignsInit } from "../src";

const PORT = 0;

export function createTestApp(
  options?: Parameters<typeof frontendVitalSignsInit>[1],
) {
  const app = express();

  app.get("/test/dynamic", (req, res) => {
    res.status(200).send("Dynamic test endpoint called.");
  });

  app.get("/test/static", (req, res) => {
    res.status(200).send("Static test endpoint called.");
  });

  const server = app.listen(PORT, () => {
    console.log(`Test app listening on port ${PORT}`);
  });

  frontendVitalSignsInit(server, options);

  return server;
}
