export class MealPlanGenerationError extends Error {
  public statusCode: number;
  public details?: Record<string, unknown>;

  constructor(message: string, statusCode = 400, details?: Record<string, unknown>) {
    super(message);
    this.name = "MealPlanGenerationError";
    this.statusCode = statusCode;
    this.details = details;
  }
}

