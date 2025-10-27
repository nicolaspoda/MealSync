import { Controller, Get, Path, Query, Route } from "tsoa";
import type { Meal } from "./meal";
import { MealsService } from "./mealsService";

@Route("meals")
export class MealsController extends Controller {
  @Get()
  public async getMeals(): Promise<Meal[]> {
    return new MealsService().getAll();
  }

  @Get("{mealId}")
  public async getMeal(
    @Path() mealId: string,
    @Query() title?: string
  ): Promise<Meal> {
    return new MealsService().get(mealId, title);
  }
}
