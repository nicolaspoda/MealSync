import {
  Body,
  Controller,
  Post,
  Route,
  SuccessResponse,
  Response,
  Security,
  Tags,
} from "tsoa";
import type { MealPlan, MealPlanGenerationParams } from "./mealPlan";
import { MealPlanService } from "./mealPlanService";
import ValidateErrorJSON from "../shared/validationErrorJSON";

@Route("meal-plans")
@Tags("Meal Plans")
export class MealPlansController extends Controller {
  /**
   * Generate a personalized meal plan either from a user profile (recommended) or from explicit nutritional objectives.
   * When a `userId` is provided, the service automatically loads the profile (target calories, allergies, equipments, prep time, etc.)
   * and merges it with any overrides passed in the payload.
   * 
   * @param requestBody Parameters including optional userId, objectives (target calories, macros) and constraints (excluded aliments, available equipments, meals per day)
   */
  @Response<ValidateErrorJSON>(422, "Validation Failed")
  @SuccessResponse("201", "Meal Plan Generated")
  @Post("generate")
  @Security("api_key")
  public async generateMealPlan(
    @Body() requestBody: MealPlanGenerationParams
  ): Promise<MealPlan> {
    try {
      this.setStatus(201);
      return await new MealPlanService().generateMealPlan(requestBody);
    } catch (error: any) {
      this.setStatus(400);
      throw new Error(error.message || "Unable to generate meal plan with given constraints");
    }
  }
}