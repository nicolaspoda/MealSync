import { UUID } from "../shared/uuid";

/**
 * The Preparation object represents a cooking step in meal preparation.
 * @example {
 *  "id": "52907745-7672-470e-a803-a2f8feb52944",
 *  "step": 1,
 *  "description": "Faire cuire le riz dans l'eau bouillante salée",
 *  "estimated_time": 15,
 *  "meals": []
 * }
 */
export interface Preparation {
  id: UUID;
  /**
   * @isInt step must be an integer
   * @minimum 1 step must be at least 1
   */
  step: number;
  /**
   * @isString description must be a string value
   * @minLength 5 description must be at least 5 characters
   * @maxLength 200 description must be at most 200 characters
   */
  description: string;
  /**
   * @isInt estimated_time must be an integer
   * @minimum 1 estimated_time must be at least 1 minute
   */
  estimated_time: number;
  /**
   * @minItems 0 meals array can be empty
   */
  meals?: PreparationMeal[];
}

export interface PreparationMeal {
  mealId: string;
  order: number;
  meal?: {
    id: string;
    title: string;
    description: string;
    calories: number;
  };
}