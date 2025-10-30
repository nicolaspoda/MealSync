import type { Meal, PaginatedMeals, MealListParams, NutritionAnalysis } from "./meal";
import { prisma } from "../shared/prisma";

export type MealCreationParams = Omit<
  Meal,
  "id" | "createdAt" | "updatedAt" | "aliments" | "preparations" | "equipements"
> & {
  aliments?: { alimentId: string; quantity: number }[];
  preparations?: { preparationId: string; order: number }[];
  equipements?: { equipmentId: string }[];
};

interface SuggestionFilters {
  targetCalories?: number;
  maxTime?: number;
  excludedAliments?: string[];
  availableEquipments?: string[];
  preferredMacros?: string;
  limit: number;
}

export class MealsService {
  public async get(id: string): Promise<Meal | null> {
    const meal = await prisma.meal.findUnique({
      where: { id },
      include: {
        aliments: {
          include: {
            aliment: true,
          },
        },
        preparations: {
          include: {
            preparation: true,
          },
          orderBy: {
            order: "asc",
          },
        },
        equipments: {
          include: {
            equipment: true,
          },
        },
      },
    });

    return meal;
  }

  public async getAll(): Promise<Meal[]> {
    const meals = await prisma.meal.findMany({
      include: {
        aliments: {
          include: {
            aliment: true,
          },
        },
        preparations: {
          include: {
            preparation: true,
          },
          orderBy: {
            order: "asc",
          },
        },
        equipments: {
          include: {
            equipment: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return meals;
  }

  public async getAllPaginated(params: MealListParams = {}): Promise<PaginatedMeals> {
    const {
      page = 1,
      limit = 10,
      title,
      minCalories,
      maxCalories,
      aliment,
      equipment
    } = params;

    const skip = (page - 1) * limit;

    // Build where clause for filters
    const whereClause: any = {};

    if (title) {
      whereClause.title = {
        contains: title
      };
    }

    if (minCalories !== undefined || maxCalories !== undefined) {
      whereClause.calories = {};
      if (minCalories !== undefined) {
        whereClause.calories.gte = minCalories;
      }
      if (maxCalories !== undefined) {
        whereClause.calories.lte = maxCalories;
      }
    }

    if (aliment) {
      whereClause.aliments = {
        some: {
          aliment: {
            name: {
              contains: aliment
            }
          }
        }
      };
    }

    if (equipment) {
      whereClause.equipments = {
        some: {
          equipment: {
            name: {
              contains: equipment
            }
          }
        }
      };
    }

    // Get total count for pagination
    const total = await prisma.meal.count({
      where: whereClause
    });

    // Get paginated results
    const meals = await prisma.meal.findMany({
      where: whereClause,
      include: {
        aliments: {
          include: {
            aliment: true,
          },
        },
        preparations: {
          include: {
            preparation: true,
          },
          orderBy: {
            order: "asc",
          },
        },
        equipments: {
          include: {
            equipment: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      skip,
      take: limit,
    });

    const totalPages = Math.ceil(total / limit);

    return {
      data: meals,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    };
  }

  public async create(mealCreationParams: MealCreationParams): Promise<Meal> {
    const {
      aliments = [],
      preparations = [],
      equipements = [],
      ...mealData
    } = mealCreationParams;

    const meal = await prisma.meal.create({
      data: {
        ...mealData,
        aliments: {
          create: aliments.map((aliment) => ({
            alimentId: aliment.alimentId,
            quantity: aliment.quantity,
          })),
        },
        preparations: {
          create: preparations.map((prep) => ({
            preparationId: prep.preparationId,
            order: prep.order,
          })),
        },
        equipments: {
          create: equipements.map((equip) => ({
            equipmentId: equip.equipmentId,
          })),
        },
      },
      include: {
        aliments: {
          include: {
            aliment: true,
          },
        },
        preparations: {
          include: {
            preparation: true,
          },
          orderBy: {
            order: "asc",
          },
        },
        equipments: {
          include: {
            equipment: true,
          },
        },
      },
    });

    return meal;
  }

  public async update(
    id: string,
    mealUpdateParams: Partial<MealCreationParams>
  ): Promise<Meal | null> {
    const { aliments, preparations, equipements, ...mealData } =
      mealUpdateParams;

    const updatedMeal = await prisma.meal.update({
      where: { id },
      data: mealData,
      include: {
        aliments: {
          include: {
            aliment: true,
          },
        },
        preparations: {
          include: {
            preparation: true,
          },
          orderBy: {
            order: "asc",
          },
        },
        equipments: {
          include: {
            equipment: true,
          },
        },
      },
    });

    if (aliments !== undefined) {
      await prisma.mealAliment.deleteMany({ where: { mealId: id } });
      if (aliments.length > 0) {
        await prisma.mealAliment.createMany({
          data: aliments.map((aliment) => ({
            mealId: id,
            alimentId: aliment.alimentId,
            quantity: aliment.quantity,
          })),
        });
      }
    }

    if (preparations !== undefined) {
      await prisma.mealPreparation.deleteMany({ where: { mealId: id } });
      if (preparations.length > 0) {
        await prisma.mealPreparation.createMany({
          data: preparations.map((prep) => ({
            mealId: id,
            preparationId: prep.preparationId,
            order: prep.order,
          })),
        });
      }
    }

    if (equipements !== undefined) {
      await prisma.mealEquipment.deleteMany({ where: { mealId: id } });
      if (equipements.length > 0) {
        await prisma.mealEquipment.createMany({
          data: equipements.map((equip) => ({
            mealId: id,
            equipmentId: equip.equipmentId,
          })),
        });
      }
    }

    return this.get(id);
  }

  public async delete(id: string): Promise<boolean> {
    try {
      await prisma.meal.delete({
        where: { id },
      });
      return true;
    } catch (error) {
      return false;
    }
  }

  public async getQuickMeals(
    maxTime: number, 
    params: { page?: number; limit?: number } = {}
  ): Promise<PaginatedMeals> {
    try {
      console.log(`[DEBUG] getQuickMeals called with maxTime: ${maxTime}, params:`, params);
      
      // Validate maxTime parameter
      if (!maxTime || maxTime <= 0) {
        throw new Error("maxTime parameter must be a positive number");
      }

      const { page = 1, limit = 10 } = params;
      console.log(`[DEBUG] Using page: ${page}, limit: ${limit}`);

      // Get all meals with their preparation times
      const allMeals = await prisma.meal.findMany({
        include: {
          aliments: {
            include: {
              aliment: true,
            },
          },
          preparations: {
            include: {
              preparation: true,
            },
            orderBy: {
              order: "asc",
            },
          },
          equipments: {
            include: {
              equipment: true,
            },
          },
        },
      });

      console.log(`[DEBUG] Found ${allMeals.length} total meals`);

      // Filter meals by total preparation time and sort by time
      const filteredMeals = allMeals
        .map(meal => {
          const totalTime = meal.preparations.reduce(
            (sum, prep) => sum + (prep.preparation?.estimated_time || 0), 
            0
          );
          console.log(`[DEBUG] Meal "${meal.title}" has preparation time: ${totalTime} minutes`);
          return { ...meal, totalPreparationTime: totalTime };
        })
        .filter(meal => meal.totalPreparationTime <= maxTime)
        .sort((a, b) => a.totalPreparationTime - b.totalPreparationTime);

      console.log(`[DEBUG] After filtering by maxTime ${maxTime}: ${filteredMeals.length} meals`);

      // Apply pagination
      const total = filteredMeals.length;
      const totalPages = Math.ceil(total / limit);
      const skip = (page - 1) * limit;
      const paginatedMeals = filteredMeals.slice(skip, skip + limit);

      console.log(`[DEBUG] Returning ${paginatedMeals.length} meals after pagination`);

      return {
        data: paginatedMeals,
        pagination: {
          page,
          limit,
          total,
          totalPages,
          hasNext: page < totalPages,
          hasPrev: page > 1,
        },
      };
    } catch (error) {
      console.error(`[ERROR] getQuickMeals failed:`, error);
      throw error;
    }
  }

  public async getSuggestions(filters: SuggestionFilters): Promise<Meal[]> {
    try {
      console.log(`[DEBUG] getSuggestions called with filters:`, filters);
      
      // Build where clause based on filters
      const whereClause: any = {};
      
      // Filter by excluded aliments
      if (filters.excludedAliments && filters.excludedAliments.length > 0) {
        whereClause.aliments = {
          none: {
            aliment: {
              name: {
                in: filters.excludedAliments
              }
            }
          }
        };
      }
      
      // Filter by available equipment
      if (filters.availableEquipments && filters.availableEquipments.length > 0) {
        whereClause.equipments = {
          every: {
            equipmentId: {
              in: filters.availableEquipments
            }
          }
        };
      }
      
      // Get all matching meals
      const meals = await prisma.meal.findMany({
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
      
      console.log(`[DEBUG] Found ${meals.length} meals matching base filters`);
      
      // Calculate additional metrics and apply remaining filters
      const enrichedMeals = meals.map(meal => {
        const preparationTime = meal.preparations.reduce(
          (sum, prep) => sum + (prep.preparation?.estimated_time || 0),
          0
        );
        
        const nutrition = this.calculateMealNutrition(meal);
        
        return {
          ...meal,
          preparationTime,
          nutrition
        };
      });
      
      // Apply time filter
      let filteredMeals = enrichedMeals;
      if (filters.maxTime) {
        filteredMeals = filteredMeals.filter(meal => meal.preparationTime <= filters.maxTime!);
      }
      
      // Apply calorie filter (within 20% range)
      if (filters.targetCalories) {
        const tolerance = filters.targetCalories * 0.2;
        filteredMeals = filteredMeals.filter(meal => 
          Math.abs(meal.calories - filters.targetCalories!) <= tolerance
        );
      }
      
      // Sort by preferred macros or default scoring
      filteredMeals.sort((a, b) => {
        if (filters.preferredMacros) {
          const macroA = this.getMacroScore(a.nutrition, filters.preferredMacros);
          const macroB = this.getMacroScore(b.nutrition, filters.preferredMacros);
          return macroB - macroA; // Higher score first
        }
        
        // Default: prefer balanced nutrition and shorter preparation time
        const scoreA = a.nutrition.protein + a.nutrition.carbohydrates + a.nutrition.lipids - a.preparationTime * 0.1;
        const scoreB = b.nutrition.protein + b.nutrition.carbohydrates + b.nutrition.lipids - b.preparationTime * 0.1;
        return scoreB - scoreA;
      });
      
      console.log(`[DEBUG] Returning ${Math.min(filteredMeals.length, filters.limit)} suggestions`);
      
      return filteredMeals.slice(0, filters.limit);
    } catch (error) {
      console.error(`[ERROR] getSuggestions failed:`, error);
      throw error;
    }
  }
  
  public async getNutritionAnalysis(mealId: string): Promise<NutritionAnalysis | null> {
    try {
      console.log(`[DEBUG] getNutritionAnalysis called for meal: ${mealId}`);
      
      const meal = await prisma.meal.findUnique({
        where: { id: mealId },
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
          }
        }
      });
      
      if (!meal) {
        return null;
      }
      
      let totalProtein = 0;
      let totalCarbohydrates = 0;
      let totalLipids = 0;
      let totalFiber = 0;
      let totalWeight = 0;
      
      const alimentBreakdown = meal.aliments.map(mealAliment => {
        const quantity = mealAliment.quantity;
        const portionFactor = quantity / 100; // Convert to 100g portions
        totalWeight += quantity;
        
        const alimentCalories = (mealAliment.aliment.cal_100g * portionFactor);
        
        let protein = 0, carbs = 0, lipids = 0, fiber = 0;
        
        mealAliment.aliment.macros.forEach(alimentMacro => {
          const macroName = alimentMacro.macro.name.toLowerCase();
          const macroQuantity = alimentMacro.quantity * portionFactor;
          
          if (macroName.includes('protéine') || macroName.includes('protein')) {
            protein = macroQuantity;
            totalProtein += macroQuantity;
          } else if (macroName.includes('glucide') || macroName.includes('carb')) {
            carbs = macroQuantity;
            totalCarbohydrates += macroQuantity;
          } else if (macroName.includes('lipide') || macroName.includes('fat')) {
            lipids = macroQuantity;
            totalLipids += macroQuantity;
          } else if (macroName.includes('fibre')) {
            fiber = macroQuantity;
            totalFiber += macroQuantity;
          }
        });
        
        return {
          alimentName: mealAliment.aliment.name,
          quantity: quantity,
          calories: Math.round(alimentCalories),
          macros: {
            protein: Math.round(protein * 10) / 10,
            carbohydrates: Math.round(carbs * 10) / 10,
            lipids: Math.round(lipids * 10) / 10,
            fiber: Math.round(fiber * 10) / 10
          }
        };
      });
      
      const preparationTime = meal.preparations.reduce(
        (sum, prep) => sum + (prep.preparation?.estimated_time || 0),
        0
      );
      
      const totalMacros = totalProtein + totalCarbohydrates + totalLipids;
      
      const analysis: NutritionAnalysis = {
        mealId: meal.id,
        mealTitle: meal.title,
        totalCalories: meal.calories,
        macronutrients: {
          totalProtein: Math.round(totalProtein * 10) / 10,
          totalCarbohydrates: Math.round(totalCarbohydrates * 10) / 10,
          totalLipids: Math.round(totalLipids * 10) / 10,
          totalFiber: Math.round(totalFiber * 10) / 10
        },
        alimentBreakdown,
        nutritionalDensity: {
          caloriesPerGram: totalWeight > 0 ? Math.round((meal.calories / totalWeight) * 100) / 100 : 0,
          proteinPercentage: totalMacros > 0 ? Math.round((totalProtein / totalMacros) * 100) : 0,
          carbohydratesPercentage: totalMacros > 0 ? Math.round((totalCarbohydrates / totalMacros) * 100) : 0,
          lipidsPercentage: totalMacros > 0 ? Math.round((totalLipids / totalMacros) * 100) : 0
        },
        preparationTime
      };
      
      console.log(`[DEBUG] Nutrition analysis completed for meal: ${meal.title}`);
      return analysis;
    } catch (error) {
      console.error(`[ERROR] getNutritionAnalysis failed:`, error);
      throw error;
    }
  }
  
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
  
  private getMacroScore(nutrition: any, preferredMacro: string): number {
    const macro = preferredMacro.toLowerCase();
    if (macro.includes('protein')) {
      return nutrition.protein;
    } else if (macro.includes('carb') || macro.includes('glucide')) {
      return nutrition.carbohydrates;
    } else if (macro.includes('lipid') || macro.includes('fat')) {
      return nutrition.lipids;
    }
    return 0;
  }
}
