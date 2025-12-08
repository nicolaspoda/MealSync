import { UUID } from "../shared/uuid";

/**
 * Nutritional objectives for meal plan generation
 */
export interface NutritionalObjectives {
  /**
   * Target daily calories
   * @isInt calories must be an integer
   * @minimum 1200 calories must be at least 1200
   * @maximum 5000 calories must be at most 5000
   */
  targetCalories: number;
  
  /**
   * Target macronutrients in grams
   */
  macros?: {
    /**
     * Target protein in grams
     * @isInt protein must be an integer
     * @minimum 0 protein must be at least 0
     */
    protein?: number;
    /**
     * Target carbohydrates in grams
     * @isInt carbohydrates must be an integer
     * @minimum 0 carbohydrates must be at least 0
     */
    carbohydrates?: number;
    /**
     * Target lipids/fats in grams
     * @isInt lipids must be an integer
     * @minimum 0 lipids must be at least 0
     */
    lipids?: number;
  };
}

/**
 * Dietary constraints and preferences
 */
export interface DietaryConstraints {
  /**
   * List of aliment names to exclude
   */
  excludedAliments?: string[];
  
  /**
   * List of equipment IDs that are available
   */
  availableEquipments?: string[];
  
  /**
   * Number of meals per day
   * @isInt mealsPerDay must be an integer
   * @minimum 1 mealsPerDay must be at least 1
   * @maximum 6 mealsPerDay must be at most 6
   */
  mealsPerDay?: number;

  /**
   * Maximum preparation time allowed per meal (minutes)
   * @minimum 5 maxPreparationTime must be at least 5 minutes
   * @maximum 240 maxPreparationTime must be at most 4 hours
   */
  maxPreparationTime?: number;
}

/**
 * Parameters for generating a meal plan
 */
export interface MealPlanGenerationParams {
  /**
   * Optional user profile ID to pull objectives and constraints from.
   * When provided, explicit objectives/constraints override profile values.
   */
  userId?: string;

  /**
   * Nutritional objectives. Optional if userId is provided.
   */
  objectives?: NutritionalObjectives;

  /**
   * Dietary constraints or overrides.
   */
  constraints?: DietaryConstraints;
}

/**
 * A single meal in the generated plan
 */
export interface PlannedMeal {
  meal: {
    id: string;
    title: string;
    description: string;
    calories: number;
    totalPreparationTime: number;
  };
  /**
   * When to consume this meal (breakfast, lunch, dinner, snack)
   */
  mealType: "breakfast" | "lunch" | "dinner" | "snack";
}

/**
 * Generated meal plan for one day
 */
export interface DailyMealPlan {
  /**
   * Date for this meal plan
   */
  date: Date;
  
  /**
   * List of planned meals for the day
   */
  meals: PlannedMeal[];
  
  /**
   * Nutritional summary for the day
   */
  nutritionalSummary: {
    totalCalories: number;
    totalProtein: number;
    totalCarbohydrates: number;
    totalLipids: number;
  };
  
  /**
   * Total preparation time for all meals in minutes
   */
  totalPreparationTime: number;
}

/**
 * Generated meal plan response
 * @example {
 *  "dailyPlan": {
 *    "date": "2025-10-30T00:00:00.000Z",
 *    "meals": [
 *      {
 *        "meal": {
 *          "id": "meal-id",
 *          "title": "Poulet au riz et brocolis",
 *          "description": "Un repas équilibré",
 *          "calories": 450,
 *          "totalPreparationTime": 33
 *        },
 *        "mealType": "lunch"
 *      }
 *    ],
 *    "nutritionalSummary": {
 *      "totalCalories": 450,
 *      "totalProtein": 31,
 *      "totalCarbohydrates": 78,
 *      "totalLipids": 12
 *    },
 *    "totalPreparationTime": 33
 *  }
 * }
 */
export interface MealPlan {
  dailyPlan: DailyMealPlan;
}