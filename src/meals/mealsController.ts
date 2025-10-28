import {
  Body,
  Controller,
  Get,
  Path,
  Post,
  Put,
  Delete,
  Query,
  Route,
  SuccessResponse,
  Response,
  Security,
  Tags,
} from "tsoa";
import type { Meal } from "./meal";
import { MealCreationParams, MealsService } from "./mealsService";
import ValidateErrorJSON from "../shared/validationErrorJSON";

@Route("meals")
@Tags("Meals")
export class MealsController extends Controller {
  @Get()
  @Security("api_key")
  public async getMeals(): Promise<Meal[]> {
    return new MealsService().getAll();
  }

  /**
   * Retrieves the details of an existing meal.
   * Supply the unique meal ID and receive corresponding meal details.
   * @param mealId The meal's identifier
   * @example mealId "52907745-7672-470e-a803-a2f8feb52944"
   */
  @Get("{mealId}")
  public async getMeal(@Path() mealId: string): Promise<Meal> {
    const meal = await new MealsService().get(mealId);
    if (!meal) {
      this.setStatus(404);
      throw new Error("Meal not found");
    }
    return meal;
  }

  @Response<ValidateErrorJSON>(422, "Validation Failed")
  @SuccessResponse("201", "Created")
  @Post()
  public async createMeal(
    @Body() requestBody: MealCreationParams
  ): Promise<Meal> {
    this.setStatus(201);
    return await new MealsService().create(requestBody);
  }

  @Response<ValidateErrorJSON>(422, "Validation Failed")
  @SuccessResponse("200", "Updated")
  @Put("{mealId}")
  public async updateMeal(
    @Path() mealId: string,
    @Body() requestBody: Partial<MealCreationParams>
  ): Promise<Meal> {
    const meal = await new MealsService().update(mealId, requestBody);
    if (!meal) {
      this.setStatus(404);
      throw new Error("Meal not found");
    }
    return meal;
  }

  @SuccessResponse("204", "Deleted")
  @Delete("{mealId}")
  public async deleteMeal(@Path() mealId: string): Promise<void> {
    const success = await new MealsService().delete(mealId);
    if (!success) {
      this.setStatus(404);
      throw new Error("Meal not found");
    }
    this.setStatus(204);
  }
}
