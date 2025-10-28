import { UUID } from "../shared/uuid";

/**
 * The Equipment object represents kitchen equipment used in meal preparation.
 * @example {
 *  "id": "52907745-7672-470e-a803-a2f8feb52944",
 *  "nom": "Poêle",
 *  "meals": []
 * }
 */
export interface Equipment {
  id: UUID;
  /**
   * @isString nom must be a string value
   * @minLength 2 nom must be at least 2 characters
   * @maxLength 40 nom must be at most 40 characters
   */
  nom: string;
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