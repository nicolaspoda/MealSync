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
import type { Meal, PaginatedMeals, MealListParams, MealAnalysisParams, MealAnalysisResult, MealAnalysisDBParams, MealAnalysisUnifiedParams, NutritionAnalysis } from "./meal";
import { MealCreationParams, MealsService } from "./mealsService";
import ValidateErrorJSON from "../shared/validationErrorJSON";

@Route("meals")
@Tags("Meals")
export class MealsController extends Controller {
  /**
   * Retrieves meals with optional pagination, filtering, and suggestion features.
   * This endpoint consolidates multiple meal listing functionalities:
   * - Without parameters: returns all meals
   * - With pagination (page/limit): returns paginated results with optional filters
   * - With maxTime: returns quick meals (meals that can be prepared within the time limit)
   * - With suggestion parameters (targetCalories, excludedAliments, etc.): returns personalized suggestions
   * 
   * @param page Page number for pagination (default: undefined, returns all if not specified)
   * @param limit Number of items per page (default: 10, max: 100, only used with pagination)
   * @param title Filter by meal title (partial match)
   * @param minCalories Filter by minimum calories
   * @param maxCalories Filter by maximum calories
   * @param aliment Filter by aliment name (partial match)
   * @param equipment Filter by equipment name (partial match)
   * @param maxTime Maximum preparation time in minutes (returns quick meals)
   * @param targetCalories Target calories for suggestions (triggers suggestion mode)
   * @param excludedAliments Comma-separated list of aliment names to exclude (for suggestions)
   * @param availableEquipments Comma-separated list of equipment IDs available (for suggestions)
   * @param preferredMacros Preferred macronutrient for suggestions (protein, carbohydrates, lipids)
   * @param suggestionsLimit Number of suggestions to return (default: 5, max: 20, only used with suggestions)
   */
  @Get()
  public async getMeals(
    @Query() page?: number,
    @Query() limit?: number,
    @Query() title?: string,
    @Query() minCalories?: number,
    @Query() maxCalories?: number,
    @Query() aliment?: string,
    @Query() equipment?: string,
    @Query() maxTime?: number,
    @Query() targetCalories?: number,
    @Query() excludedAliments?: string,
    @Query() availableEquipments?: string,
    @Query() preferredMacros?: string,
    @Query() suggestionsLimit?: number
  ): Promise<Meal[] | PaginatedMeals> {
    const service = new MealsService();

    // Suggestion mode: if targetCalories or other suggestion params are provided
    if (targetCalories !== undefined || excludedAliments !== undefined || 
        availableEquipments !== undefined || preferredMacros !== undefined) {
      const filters = {
        targetCalories,
        maxTime,
        excludedAliments: excludedAliments ? excludedAliments.split(',') : undefined,
        availableEquipments: availableEquipments ? availableEquipments.split(',') : undefined,
        preferredMacros,
        limit: suggestionsLimit || 5
      };
      return service.getSuggestions(filters);
    }

    // Quick meals mode: if maxTime is provided (without suggestion params)
    if (maxTime !== undefined) {
      return service.getQuickMeals(maxTime, { page, limit });
    }

    // Pagination mode: if page or limit is provided
    if (page !== undefined || limit !== undefined) {
      const params: MealListParams = {
        page,
        limit,
        title,
        minCalories,
        maxCalories,
        aliment,
        equipment
      };
      return service.getAllPaginated(params);
    }

    // Default: return all meals (if filters are provided, still return all but could be enhanced later)
    // For now, if filters are provided without pagination, we still return all
    // This could be enhanced to apply filters even without pagination
    return service.getAll();
  }

  /**
   * Get personalized meal suggestions based on user profile
   * Uses the user's complete profile to filter and score meals automatically
   * @param userId The user's identifier (required)
   * @param mealType Optional meal type (BREAKFAST, LUNCH, DINNER, SNACK)
   * @param limit Maximum number of suggestions to return (default: 10)
   */
  @Get("suggestions")
  @Security("api_key")
  public async getPersonalizedSuggestions(
    @Query() userId: string,
    @Query() mealType?: string,
    @Query() limit?: number
  ): Promise<Meal[]> {
    if (!userId) {
      this.setStatus(400);
      throw new Error("userId is required");
    }
    
    const service = new MealsService();
    
    // Cast mealType string to MealType enum
    const mealTypeEnum = mealType as any;
    
    const suggestions = await service.getPersonalizedSuggestions(
      userId,
      mealTypeEnum,
      limit || 10
    );
    
    return suggestions;
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
   * Supply the unique meal ID and receive corresponding meal details (ingredients, equipments, recipe, nutritional values).
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

  /**
   * Creates a new meal in the database.
   * Allows adding a new meal with its ingredients, required equipments, recipe and nutritional values.
   * @param requestBody The meal creation parameters including title, aliments, equipments, recipe and nutritional values
   */
  @Response<ValidateErrorJSON>(422, "Validation Failed")
  @SuccessResponse("201", "Created")
  @Post()
  @Security("api_key")
  public async createMeal(
    @Body() requestBody: MealCreationParams
  ): Promise<Meal> {
    this.setStatus(201);
    return await new MealsService().create(requestBody);
  }

  /**
   * Updates the information of an existing meal.
   * Allows partial or complete modification of meal properties (title, ingredients, equipments, recipe, nutritional values).
   * @param mealId The unique identifier of the meal to update
   * @param requestBody The fields to update (all fields are optional)
   * @example mealId "52907745-7672-470e-a803-a2f8feb52944"
   */
  @Response<ValidateErrorJSON>(422, "Validation Failed")
  @SuccessResponse("200", "Updated")
  @Put("{mealId}")
  @Security("api_key")
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

  /**
   * Deletes a meal from the database.
   * This operation is irreversible. The meal will be permanently removed from the system.
   * @param mealId The unique identifier of the meal to delete
   * @example mealId "52907745-7672-470e-a803-a2f8feb52944"
   */
  @SuccessResponse("204", "Deleted")
  @Delete("{mealId}")
  @Security("api_key")
  public async deleteMeal(@Path() mealId: string): Promise<void> {
    try {
      await new MealsService().delete(mealId);
      this.setStatus(204);
    } catch (error: unknown) {
      const err = error as Error;
      if (err.message.includes("not found") || err.message.includes("Record to delete does not exist")) {
        this.setStatus(404);
        throw new Error("Meal not found");
      }
      throw error;
    }
  }
  
  /**
   * Analyze a meal composition without persisting it.
   * Can analyze either:
   * - A payload with nutrition values provided directly (fromDb=false or omitted)
   * - Aliments referenced from the database by ID or name (fromDb=true)
   * 
   * @param fromDb If true, expects aliment references (alimentId/name + quantity) and fetches nutrition from DB.
   *               If false or omitted, expects full nutrition data in the payload or will try to fetch from DB if alimentId is provided.
   * @param payload The aliments to analyze:
   *                - If fromDb=true: array of { alimentId?, name?, quantity }
   *                - If fromDb=false: array of { alimentId?, name?, quantity, cal_100g?, protein_100g?, carbs_100g?, fat_100g? }
   */
  @Response<ValidateErrorJSON>(422, "Validation Failed")
  @SuccessResponse("200", "Analysis computed")
  @Post("analyze")
  @Security("api_key")
  public async analyzeMeal(
    @Body() payload: MealAnalysisUnifiedParams,
    @Query() fromDb?: boolean
  ): Promise<MealAnalysisResult> {
    const service = new MealsService();
    
    if (fromDb === true) {
      // Convert to DB params format
      const dbParams: MealAnalysisDBParams = {
        aliments: payload.aliments.map(a => ({
          alimentId: (a as any).alimentId,
          name: (a as any).name,
          quantity: a.quantity
        }))
      };
      return await service.analyzeFromDb(dbParams);
    } else {
      // Convert to payload format
      const analysisParams: MealAnalysisParams = {
        aliments: payload.aliments.map(a => ({
          alimentId: (a as any).alimentId,
          name: (a as any).name,
          quantity: a.quantity,
          cal_100g: (a as any).cal_100g,
          protein_100g: (a as any).protein_100g,
          carbs_100g: (a as any).carbs_100g,
          fat_100g: (a as any).fat_100g
        }))
      };
      return await service.analyzePayload(analysisParams);
    }
  }
}


