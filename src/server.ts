// src/server.ts
import "dotenv/config";
import { app } from "./app";
import { logger } from "./shared/logger";

const port = process.env.PORT || 3000;

app.listen(port, () => {
  logger.info(`MealSync API server started`, {
    port,
    environment: process.env.NODE_ENV || "development",
    docs: `http://localhost:${port}/docs`,
  });
});
