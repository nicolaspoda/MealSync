import express, {
  json,
  urlencoded,
  Request as ExRequest,
  Response as ExResponse,
} from "express";
import { RegisterRoutes } from "../build/routes";
import swaggerUi from "swagger-ui-express";

export const app = express();

// Use body parser to read sent json payloads
app.use(
  urlencoded({
    extended: true,
  })
);
app.use(json());

app.use("/docs", swaggerUi.serve, async (_req: ExRequest, res: ExResponse) => {
  return res.send(
    swaggerUi.generateHTML(await import("../build/swagger.json"))
  );
});

RegisterRoutes(app);
