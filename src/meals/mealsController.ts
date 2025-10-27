import {
  Body,
  Controller,
  Get,
  Path,
  Post,
  Query,
  Route,
  SuccessResponse,
  Response,
} from "tsoa";
import type { Meal } from "./meal";
import { MealCreationParams, MealsService } from "./mealsService";
import ValidateErrorJSON from "../shared/validationErrorJSON";

@Route("meals")
export class MealsController extends Controller {
  @Get()
  public async getMeals(): Promise<Meal[]> {
    return new MealsService().getAll();
  }

  /**
   * Retrieves the details of an existing meal.
   * Supply the unique meal ID from either and receive corresponding meal details.
   * @param mealId The meal's identifier
   * @param title The title to display
   * @example mealId "52907745-7672-470e-a803-a2f8feb52944"
   */
  @Get("{mealId}")
  public async getMeal(
    @Path() mealId: string,
    @Query() title?: string
  ): Promise<Meal> {
    return new MealsService().get(mealId, title);
  }

  @Response<ValidateErrorJSON>(422, "Validation Failed")
  @SuccessResponse("201", "Created")
  @Post()
  public async createMeal(
    @Body() requestBody: MealCreationParams
  ): Promise<void> {
    this.setStatus(201);
    new MealsService().create(requestBody);
    return;
  }
}
