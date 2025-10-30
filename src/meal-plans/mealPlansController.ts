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
   * Generate a personalized meal plan based on nutritional objectives and dietary constraints.
   * The system will create an optimal daily meal plan that matches your caloric and macronutrient goals
   * while respecting your equipment availability and food preferences.
   * 
   * @param requestBody Parameters including objectives (target calories, macros) and constraints (excluded aliments, available equipments, meals per day)
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