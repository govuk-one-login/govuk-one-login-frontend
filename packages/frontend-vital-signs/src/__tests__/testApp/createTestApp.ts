import express from "express";
import { frontendVitalSignsInit } from "../..";

const PORT = 0;

export function createTestApp(
  options?: Parameters<typeof frontendVitalSignsInit>[1],
) {
  const app = express();

  app.get("/test/dynamic", (_req, res) => {
    res.status(200).send("Dynamic test endpoint called.");
  });

  app.get("/test/static", (_req, res) => {
    res.status(200).send("Static test endpoint called.");
  });

  const server = app.listen(PORT, () => {
    console.log(`Test app listening on port ${PORT}`);
  });

  frontendVitalSignsInit(server, options);

  return server;
}
