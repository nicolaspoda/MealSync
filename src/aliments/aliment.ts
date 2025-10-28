import { UUID } from "../shared/uuid";

/**
 * The Aliment object represents a food ingredient with nutritional information.
 * @example {
 *  "id": "52907745-7672-470e-a803-a2f8feb52944",
 *  "nom": "Poulet",
 *  "cal_100g": 165,
 *  "macros": []
 * }
 */
export interface Aliment {
  id: UUID;
  /**
   * @isString nom must be a string value
   * @minLength 2 nom must be at least 2 characters
   * @maxLength 50 nom must be at most 50 characters
   */
  nom: string;
  /**
   * @isInt cal_100g must be an integer
   * @minimum 0 cal_100g must be over 0
   */
  cal_100g: number;
  createdAt?: Date;
  updatedAt?: Date;
  /**
   * @minItems 0 meals array can be empty
   */
  meals?: AlimentMeal[];
  macros?: AlimentMacro[];
}

export interface AlimentMeal {
  mealId: string;
  quantite: number;
  meal?: {
    id: string;
    title: string;
    description: string;
    calories: number;
  };
}

export interface AlimentMacro {
  macroId: string;
  quantite: number;
  macro?: {
    id: string;
    nom: string;
  };
}