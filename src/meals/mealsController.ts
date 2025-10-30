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
import type { Meal, PaginatedMeals, MealListParams, NutritionAnalysis } from "./meal";
import { MealCreationParams, MealsService } from "./mealsService";
import ValidateErrorJSON from "../shared/validationErrorJSON";

@Route("meals")
@Tags("Meals")
export class MealsController extends Controller {
  /**
   * Retrieves a paginated list of meals with optional filters.
   * @param page Page number (default: 1)
   * @param limit Number of items per page (default: 10, max: 100)
   * @param title Filter by meal title (partial match)
   * @param minCalories Filter by minimum calories
   * @param maxCalories Filter by maximum calories  
   * @param aliment Filter by aliment name (partial match)
   * @param equipment Filter by equipment name (partial match)
   */
  @Get("paginated")
  @Security("api_key")
  public async getMealsPaginated(
    @Query() page?: number,
    @Query() limit?: number,
    @Query() title?: string,
    @Query() minCalories?: number,
    @Query() maxCalories?: number,
    @Query() aliment?: string,
    @Query() equipment?: string
  ): Promise<PaginatedMeals> {
    const params: MealListParams = {
      page,
      limit,
      title,
      minCalories,
      maxCalories,
      aliment,
      equipment
    };
    return new MealsService().getAllPaginated(params);
  }

  @Get()
  @Security("api_key")
  public async getMeals(): Promise<Meal[]> {
    return new MealsService().getAll();
  }

  /**
   * Retrieves meals that can be prepared within the specified time limit.
   * @param maxTime Maximum preparation time in minutes
   * @param page Page number (default: 1)
   * @param limit Number of items per page (default: 10, max: 100)
   */
  @Get("quick")
  @Security("api_key")
  public async getQuickMeals(
    @Query() maxTime: number,
    @Query() page?: number,
    @Query() limit?: number
  ): Promise<PaginatedMeals> {
    return new MealsService().getQuickMeals(maxTime, { page, limit });
  }

  /**
   * Get personalized meal suggestions based on user preferences, nutritional objectives and filters.
   * Returns meals that match dietary preferences, caloric targets, excluded ingredients, and available equipment.
   * @param targetCalories Target calories for suggested meals
   * @param maxTime Maximum preparation time in minutes
   * @param excludedAliments Comma-separated list of aliment names to exclude
   * @param availableEquipments Comma-separated list of equipment IDs available
   * @param preferredMacros Preferred macronutrient (protein, carbohydrates, lipids)
   * @param limit Number of suggestions to return (default: 5, max: 20)
   */
  @Get("suggestions")
  @Security("api_key")
  public async getMealSuggestions(
    @Query() targetCalories?: number,
    @Query() maxTime?: number,
    @Query() excludedAliments?: string,
    @Query() availableEquipments?: string,
    @Query() preferredMacros?: string,
    @Query() limit?: number
  ): Promise<Meal[]> {
    const filters = {
      targetCalories,
      maxTime,
      excludedAliments: excludedAliments ? excludedAliments.split(',') : undefined,
      availableEquipments: availableEquipments ? availableEquipments.split(',') : undefined,
      preferredMacros,
      limit: limit || 5
    };
    return new MealsService().getSuggestions(filters);
  }

  /**
   * Analyze the nutritional composition of a specific meal.
   * Returns detailed breakdown of calories, macronutrients, and nutritional density.
   * @param mealId The meal's identifier
   * @example mealId "52907745-7672-470e-a803-a2f8feb52944"
   */
  @Get("{mealId}/nutrition-analysis")
  public async getMealNutritionAnalysis(@Path() mealId: string): Promise<NutritionAnalysis> {
    const analysis = await new MealsService().getNutritionAnalysis(mealId);
    if (!analysis) {
      this.setStatus(404);
      throw new Error("Meal not found");
    }
    return analysis;
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
