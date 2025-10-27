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
   * @minLength 12 title must be at least 12 characters
   * @maxLength 60 title must be at most 60 characters
   */
  title: string;
  /**
   * @isString title must be a string value
   */
  description: string;
  /**
   * @isInt calories must be an integer
   * @minimum 0 calories must be over 0
   */
  calories: number;
  /**
   * @minItems 1 at least 1 aliment is required
   */
  aliments: string[];
}
