import { UUID } from "../shared/uuid";

/**
 * The Meal object contains common information across
 * every meal in the system regardless of calories and aliments.
 * @example {
 *  "id": "52907745-7672-470e-a803-a2f8feb52944",
 *  "titre": "My healthy meal",
 *  "description": "A healthy meal for a healthy body",
 *  "calories": "650",
 *  "aliments": []
 * }
 */
export interface Meal {
  id: UUID;
  /**
   * @isString titre must be a string value
   * @minLength 3 titre must be at least 3 characters
   * @maxLength 60 titre must be at most 60 characters
   */
  titre: string;
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
  equipements?: MealEquipement[];
}

export interface MealAliment {
  alimentId: string;
  quantite: number;
  aliment?: {
    id: string;
    nom: string;
    cal_100g: number;
  };
}

export interface MealPreparation {
  preparationId: string;
  ordre: number;
  preparation?: {
    id: string;
    etape: number;
    description: string;
    temps_estime: number;
  };
}

export interface MealEquipement {
  equipmentId: string;
  equipment?: {
    id: string;
    nom: string;
  };
}
