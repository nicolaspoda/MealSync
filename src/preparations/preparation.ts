import { UUID } from "../shared/uuid";

/**
 * The Preparation object represents a cooking step in meal preparation.
 * @example {
 *  "id": "52907745-7672-470e-a803-a2f8feb52944",
 *  "etape": 1,
 *  "description": "Faire cuire le riz dans l'eau bouillante salée",
 *  "temps_estime": 15,
 *  "meals": []
 * }
 */
export interface Preparation {
  id: UUID;
  /**
   * @isInt etape must be an integer
   * @minimum 1 etape must be at least 1
   */
  etape: number;
  /**
   * @isString description must be a string value
   * @minLength 5 description must be at least 5 characters
   * @maxLength 200 description must be at most 200 characters
   */
  description: string;
  /**
   * @isInt temps_estime must be an integer
   * @minimum 1 temps_estime must be at least 1 minute
   */
  temps_estime: number;
  /**
   * @minItems 0 meals array can be empty
   */
  meals?: PreparationMeal[];
}

export interface PreparationMeal {
  mealId: string;
  ordre: number;
  meal?: {
    id: string;
    title: string;
    description: string;
    calories: number;
  };
}