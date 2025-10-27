import { UUID } from "../shared/uuid";

/**
 * The Meal object contains common information across
 * every meal in the system regardless of calories and aliments.
 */
export interface Meal {
  id: UUID;
  title: string;
  description: string;
  calories: number;
  aliment: string[];
}
