import express, {
  json,
  urlencoded,
  Request as ExRequest,
  Response as ExResponse,
  NextFunction,
} from "express";
import cors from "cors";
import rateLimit from "express-rate-limit";
import { RegisterRoutes } from "../build/routes";
import swaggerUi from "swagger-ui-express";
import { ValidateError } from "tsoa";
import { logger } from "./shared/logger";
import { MealPlanGenerationError } from "./meal-plans/errors";

export const app = express();

// Configure Rate Limiting
// Limit each IP to 100 requests per 15 minutes
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX || "100"), // Limit each IP to 100 requests per windowMs
  message: {
    error: "Too many requests from this IP, please try again later.",
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

// Apply rate limiting to all requests
app.use(limiter);

// Configure CORS
// Allow requests from frontend (adjust origin in production)
const corsOptions = {
  origin: process.env.CORS_ORIGIN || "*", // In production, specify exact frontend URL
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "x-api-key", "Authorization"],
  credentials: true, // Allow cookies if needed
};

app.use(cors(corsOptions));

// Use body parser to read sent json payloads
app.use(
  urlencoded({
    extended: true,
  })
);
app.use(json());

// Serve SwaggerUI
app.use("/api-docs", swaggerUi.serve, async (_req: ExRequest, res: ExResponse) => {
  return res.send(
    swaggerUi.generateHTML(await import("../build/swagger.json"))
  );
});

RegisterRoutes(app);

// Route not found return
app.use(function notFoundHandler(_req, res: ExResponse) {
  res.status(404).send({
    message: "Not Found",
  });
});

// Request logging middleware
app.use((req: ExRequest, res: ExResponse, next: NextFunction) => {
  logger.info("Incoming request", {
    method: req.method,
    path: req.path,
    ip: req.ip,
  });
  next();
});

// Better error handling for Tsoa Validate
app.use(function errorHandler(
  err: unknown,
  req: ExRequest,
  res: ExResponse,
  next: NextFunction
): ExResponse | void {
  if (err instanceof ValidateError) {
    logger.warn("Validation error", {
      path: req.path,
      fields: err.fields,
    });
    return res.status(422).json({
      message: "Validation Failed",
      details: err?.fields,
    });
  }
  if (err instanceof MealPlanGenerationError) {
    logger.warn("Meal plan generation error", {
      path: req.path,
      message: err.message,
      details: err.details,
    });
    return res.status(err.statusCode).json({
      message: err.message,
      details: err.details,
    });
  }
  if (err instanceof Error) {
    logger.error("Server error", {
      path: req.path,
      error: err.message,
      stack: err.stack,
    });
    
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }

  next();
});
