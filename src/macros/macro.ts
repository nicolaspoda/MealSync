import { UUID } from "../shared/uuid";

/**
 * The Macro object represents a macronutrient category.
 * @example {
 *  "id": "52907745-7672-470e-a803-a2f8feb52944",
 *  "nom": "Protéines",
 *  "aliments": []
 * }
 */
export interface Macro {
  id: UUID;
  /**
   * @isString nom must be a string value
   * @minLength 2 nom must be at least 2 characters
   * @maxLength 30 nom must be at most 30 characters
   */
  nom: string;
  /**
   * @minItems 0 aliments array can be empty
   */
  aliments?: MacroAliment[];
}

export interface MacroAliment {
  alimentId: string;
  quantite: number;
  aliment?: {
    id: string;
    nom: string;
    cal_100g: number;
  };
}