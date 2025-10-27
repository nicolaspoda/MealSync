import type { Meal } from "./meal";

export type MealCreationParams = Omit<Meal, "id">;

export class MealsService {
  public get(id: string, title?: string): Meal {
    return {
      id,
      title: title ? title : "meal1",
      description: "my super meal",
      calories: 200,
      aliments: ["test"],
    };
  }

  public getAll(): Meal[] {
    return [
      {
        id: "ggggtg-gggg",
        title: "meal1",
        description: "my super meal",
        calories: 200,
        aliments: ["test"],
      },
      {
        id: "ggggtg-gggg",
        title: "meal2",
        description: "my super meal",
        calories: 200,
        aliments: ["test"],
      },
    ];
  }

  public create(mealCreationParams: MealCreationParams): Meal {
    return {
      id: "gggth",
      ...mealCreationParams,
    };
  }
}
