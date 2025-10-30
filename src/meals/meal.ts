import { UUID } from "../shared/uuid";

/**
 * The Meal object contains common information across
 * every meal in the system regardless of calories and aliments.
 * @example {
 *  "id": "52907745-7672-470e-a803-a2f8feb52944",
 *  "title": "My healthy meal",
 *  "description": "A healthy meal for a healthy body",
 *  "calories": "650",
 *  "aliments": []
 * }
 */
export interface Meal {
  id: UUID;
  /**
   * @isString title must be a string value
   * @minLength 3 title must be at least 3 characters
   * @maxLength 60 title must be at most 60 characters
   */
  title: string;
  /**
   * @isString description must be a string value
   */
  description: string;
  /**
   * @isInt calories must be an integer
   * @minimum 0 calories must be over 0
   */
  calories: number;
  createdAt?: Date;
  updatedAt?: Date;
  /**
   * @minItems 0 aliments array can be empty
   */
  aliments?: MealAliment[];
  preparations?: MealPreparation[];
  equipements?: MealEquipment[];
}

export interface MealAliment {
  alimentId: string;
  quantity: number;
  aliment?: {
    id: string;
    name: string;
    cal_100g: number;
  };
}

export interface MealPreparation {
  preparationId: string;
  order: number;
  preparation?: {
    id: string;
    step: number;
    description: string;
    estimated_time: number;
  };
}

export interface MealEquipment {
  equipmentId: string;
  equipment?: {
    id: string;
    name: string;
  };
}

/**
 * Pagination parameters for meals listing
 */
export interface MealPaginationParams {
  /**
   * @isInt page must be an integer
   * @minimum 1 page must be at least 1
   */
  page?: number;
  /**
   * @isInt limit must be an integer
   * @minimum 1 limit must be at least 1
   * @maximum 100 limit must be at most 100
   */
  limit?: number;
}

/**
 * Filter parameters for meals listing
 */
export interface MealFilterParams {
  /**
   * Filter by meal title (partial match)
   */
  title?: string;
  /**
   * Filter by minimum calories
   * @isInt minCalories must be an integer
   * @minimum 0 minCalories must be at least 0
   */
  minCalories?: number;
  /**
   * Filter by maximum calories
   * @isInt maxCalories must be an integer
   * @minimum 0 maxCalories must be at least 0
   */
  maxCalories?: number;
  /**
   * Filter by aliment name (partial match)
   */
  aliment?: string;
  /**
   * Filter by equipment name (partial match)
   */
  equipment?: string;
}

/**
 * Combined parameters for meals listing with pagination and filters
 */
export interface MealListParams extends MealPaginationParams, MealFilterParams {}

/**
 * Paginated response for meals
 */
export interface PaginatedMeals {
  data: Meal[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

/**
 * Detailed nutritional analysis of a meal
 */
export interface NutritionAnalysis {
  mealId: string;
  mealTitle: string;
  totalCalories: number;
  macronutrients: {
    totalProtein: number;
    totalCarbohydrates: number;
    totalLipids: number;
    totalFiber: number;
  };
  alimentBreakdown: {
    alimentName: string;
    quantity: number;
    calories: number;
    macros: {
      protein: number;
      carbohydrates: number;
      lipids: number;
      fiber: number;
    };
  }[];
  nutritionalDensity: {
    caloriesPerGram: number;
    proteinPercentage: number;
    carbohydratesPercentage: number;
    lipidsPercentage: number;
  };
  preparationTime: number;
}
