import { UUID } from "../shared/uuid";

/**
 * The Equipment object represents kitchen equipment used in meal preparation.
 * @example {
 *  "id": "52907745-7672-470e-a803-a2f8feb52944",
 *  "name": "Poêle",
 *  "meals": []
 * }
 */
export interface Equipment {
  id: UUID;
  /**
   * @isString name must be a string value
   * @minLength 2 name must be at least 2 characters
   * @maxLength 40 name must be at most 40 characters
   */
  name: string;
  /**
   * @minItems 0 meals array can be empty
   */
  meals?: EquipmentMeal[];
}

export interface EquipmentMeal {
  mealId: string;
  meal?: {
    id: string;
    title: string;
    description: string;
    calories: number;
  };
}