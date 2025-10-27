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
  title: string;
  description: string;
  calories: number;
  aliments: string[];
}
