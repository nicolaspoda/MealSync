import { UUID } from "../shared/uuid";

/**
 * The Macro object represents a macronutrient category.
 * @example {
 *  "id": "52907745-7672-470e-a803-a2f8feb52944",
 *  "name": "Protéines",
 *  "aliments": []
 * }
 */
export interface Macro {
  id: UUID;
  /**
   * @isString name must be a string value
   * @minLength 2 name must be at least 2 characters
   * @maxLength 30 name must be at most 30 characters
   */
  name: string;
  /**
   * @minItems 0 aliments array can be empty
   */
  aliments?: MacroAliment[];
}

export interface MacroAliment {
  alimentId: string;
  quantity: number;
  aliment?: {
    id: string;
    name: string;
    cal_100g: number;
  };
}