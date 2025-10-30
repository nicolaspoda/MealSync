import type { 
  MealPlan, 
  MealPlanGenerationParams, 
  DailyMealPlan, 
  PlannedMeal,
  NutritionalObjectives,
  DietaryConstraints
} from "./mealPlan";
import { prisma } from "../shared/prisma";

export class MealPlanService {
  
  /**
   * Generate a personalized meal plan based on objectives and constraints
   */
  public async generateMealPlan(params: MealPlanGenerationParams): Promise<MealPlan> {
    const { objectives, constraints = {} } = params;
    
    // Get available meals based on constraints
    const availableMeals = await this.getAvailableMeals(constraints);
    
    if (availableMeals.length === 0) {
      throw new Error("No meals available with the given constraints");
    }
    
    // Calculate meals distribution based on mealsPerDay
    const mealsPerDay = constraints.mealsPerDay || 3;
    const caloriesPerMeal = Math.round(objectives.targetCalories / mealsPerDay);
    
    // Select meals to meet objectives
    const selectedMeals = await this.selectOptimalMeals(
      availableMeals,
      objectives,
      mealsPerDay,
      caloriesPerMeal
    );
    
    // Create daily meal plan
    const dailyPlan = await this.createDailyPlan(selectedMeals, objectives);
    
    return {
      dailyPlan
    };
  }
  
  /**
   * Get meals that match dietary constraints
   */
  private async getAvailableMeals(constraints: DietaryConstraints) {
    const whereClause: any = {};
    
    // Exclude specific aliments
    if (constraints.excludedAliments && constraints.excludedAliments.length > 0) {
      whereClause.aliments = {
        none: {
          aliment: {
            name: {
              in: constraints.excludedAliments
            }
          }
        }
      };
    }
    
    // Filter by available equipment
    if (constraints.availableEquipments && constraints.availableEquipments.length > 0) {
      whereClause.equipments = {
        every: {
          equipmentId: {
            in: constraints.availableEquipments
          }
        }
      };
    }
    
    return await prisma.meal.findMany({
      where: whereClause,
      include: {
        aliments: {
          include: {
            aliment: {
              include: {
                macros: {
                  include: {
                    macro: true
                  }
                }
              }
            }
          }
        },
        preparations: {
          include: {
            preparation: true
          },
          orderBy: {
            order: "asc"
          }
        },
        equipments: {
          include: {
            equipment: true
          }
        }
      }
    });
  }
  
  /**
   * Select optimal meals to meet nutritional objectives
   */
  private async selectOptimalMeals(
    availableMeals: any[], 
    objectives: NutritionalObjectives,
    mealsPerDay: number,
    targetCaloriesPerMeal: number
  ): Promise<any[]> {
    const selectedMeals: any[] = [];
    const mealTypes = this.getMealTypes(mealsPerDay);
    
    // Calculate nutritional content for each meal
    const mealsWithNutrition = availableMeals.map(meal => {
      const nutrition = this.calculateMealNutrition(meal);
      const preparationTime = meal.preparations.reduce(
        (sum: number, prep: any) => sum + (prep.preparation?.estimated_time || 0), 
        0
      );
      
      return {
        ...meal,
        nutrition,
        preparationTime
      };
    });
    
    // Sort meals by how close they are to target calories per meal
    const sortedMeals = mealsWithNutrition.sort((a, b) => {
      const diffA = Math.abs(a.calories - targetCaloriesPerMeal);
      const diffB = Math.abs(b.calories - targetCaloriesPerMeal);
      return diffA - diffB;
    });
    
    // Select meals for each meal type
    for (let i = 0; i < mealsPerDay && i < sortedMeals.length; i++) {
      selectedMeals.push({
        ...sortedMeals[i],
        mealType: mealTypes[i]
      });
    }
    
    return selectedMeals;
  }
  
  /**
   * Calculate nutritional content of a meal
   */
  private calculateMealNutrition(meal: any) {
    let totalProtein = 0;
    let totalCarbohydrates = 0;
    let totalLipids = 0;
    
    meal.aliments.forEach((mealAliment: any) => {
      const quantity = mealAliment.quantity / 100; // Convert to 100g portions
      
      mealAliment.aliment.macros.forEach((alimentMacro: any) => {
        const macroName = alimentMacro.macro.name.toLowerCase();
        const macroQuantity = alimentMacro.quantity * quantity;
        
        if (macroName.includes('protéine') || macroName.includes('protein')) {
          totalProtein += macroQuantity;
        } else if (macroName.includes('glucide') || macroName.includes('carb')) {
          totalCarbohydrates += macroQuantity;
        } else if (macroName.includes('lipide') || macroName.includes('fat')) {
          totalLipids += macroQuantity;
        }
      });
    });
    
    return {
      protein: Math.round(totalProtein),
      carbohydrates: Math.round(totalCarbohydrates),
      lipids: Math.round(totalLipids)
    };
  }
  
  /**
   * Get meal types based on meals per day
   */
  private getMealTypes(mealsPerDay: number): string[] {
    const allTypes = ["breakfast", "lunch", "dinner", "snack", "snack", "snack"];
    return allTypes.slice(0, mealsPerDay);
  }
  
  /**
   * Create the daily meal plan structure
   */
  private async createDailyPlan(selectedMeals: any[], objectives: NutritionalObjectives): Promise<DailyMealPlan> {
    const plannedMeals: PlannedMeal[] = selectedMeals.map(meal => ({
      meal: {
        id: meal.id,
        title: meal.title,
        description: meal.description,
        calories: meal.calories,
        totalPreparationTime: meal.preparationTime
      },
      mealType: meal.mealType as "breakfast" | "lunch" | "dinner" | "snack"
    }));
    
    // Calculate nutritional summary
    const nutritionalSummary = {
      totalCalories: selectedMeals.reduce((sum, meal) => sum + meal.calories, 0),
      totalProtein: selectedMeals.reduce((sum, meal) => sum + (meal.nutrition?.protein || 0), 0),
      totalCarbohydrates: selectedMeals.reduce((sum, meal) => sum + (meal.nutrition?.carbohydrates || 0), 0),
      totalLipids: selectedMeals.reduce((sum, meal) => sum + (meal.nutrition?.lipids || 0), 0)
    };
    
    const totalPreparationTime = selectedMeals.reduce((sum, meal) => sum + meal.preparationTime, 0);
    
    return {
      date: new Date(),
      meals: plannedMeals,
      nutritionalSummary,
      totalPreparationTime
    };
  }
}