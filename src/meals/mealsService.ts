import type { Meal, PaginatedMeals, MealListParams, MealAnalysisParams, MealAnalysisResult, MealAnalysisDBParams, NutritionAnalysis } from "./meal";
import { prisma } from "../shared/prisma";
import { UserProfileService } from "../users/userProfileService";
import { MetabolicCalculator } from "../users/metabolicCalculator";
import type { MealType } from "../users/userProfile";

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

  /**
   * Analyze a payload of aliments (not necessarily persisted in DB).
   * For each aliment, prefer nutrition values provided in the payload. If
   * those are missing and an alimentId is given, try to fetch nutrition from DB.
   */
  public async analyzePayload(params: MealAnalysisParams): Promise<MealAnalysisResult> {
    const perAliment: MealAnalysisResult['perAliment'] = [];
    let totalCalories = 0;
    let totalProtein = 0;
    let totalCarbs = 0;
    let totalFat = 0;
    const warnings: string[] = [];

    const aliments = params.aliments || [];

    for (const a of aliments) {
      let { alimentId, name, quantity, cal_100g, protein_100g, carbs_100g, fat_100g } = a;

      // if no nutrition provided in payload, try to get from DB using alimentId
      if (
        alimentId &&
        cal_100g === undefined &&
        protein_100g === undefined &&
        carbs_100g === undefined &&
        fat_100g === undefined
      ) {
        const dbAlim = await prisma.aliment.findUnique({ where: { id: alimentId } });
        if (dbAlim) {
          // assign if present in DB
          // some aliment records in the project may only have `cal_100g`.
          // guard with any casts to avoid type errors if the prisma typing doesn't include macros.
          const dbAny: any = dbAlim as any;
          cal_100g = cal_100g ?? dbAny.cal_100g;
          protein_100g = protein_100g ?? dbAny.protein_100g;
          carbs_100g = carbs_100g ?? dbAny.carbs_100g;
          fat_100g = fat_100g ?? dbAny.fat_100g;
          name = name ?? dbAny.name;
        }
      }

      const factor = (quantity ?? 0) / 100;

      const calories = cal_100g != null ? Math.round(cal_100g * factor) : 0;
      const protein = protein_100g != null ? Math.round(protein_100g * factor * 100) / 100 : 0;
      const carbs = carbs_100g != null ? Math.round(carbs_100g * factor * 100) / 100 : 0;
      const fat = fat_100g != null ? Math.round(fat_100g * factor * 100) / 100 : 0;

      if (
        cal_100g === undefined &&
        protein_100g === undefined &&
        carbs_100g === undefined &&
        fat_100g === undefined
      ) {
        warnings.push(`Missing nutrition per 100g for aliment ${name ?? alimentId ?? '<unknown>'}`);
      }

      perAliment.push({ alimentId, name, quantity, calories, protein, carbs, fat });

      totalCalories += calories;
      totalProtein += protein;
      totalCarbs += carbs;
      totalFat += fat;
    }

    // round totals to 2 decimals where appropriate
    totalProtein = Math.round(totalProtein * 100) / 100;
    totalCarbs = Math.round(totalCarbs * 100) / 100;
    totalFat = Math.round(totalFat * 100) / 100;

    return {
      totalCalories,
      totalProtein,
      totalCarbs,
      totalFat,
      perAliment,
      warnings: warnings.length > 0 ? warnings : undefined,
    };
  }

  /**
   * Analyze a list of aliment references (alimentId + quantity). This simulates
   * a meal using the nutrition info stored in the database without creating any
   * meal record.
   */
  public async analyzeFromDb(params: MealAnalysisDBParams): Promise<MealAnalysisResult> {
    const perAliment: MealAnalysisResult['perAliment'] = [];
    let totalCalories = 0;
    let totalProtein = 0;
    let totalCarbs = 0;
    let totalFat = 0;
    const warnings: string[] = [];

    const items = params.aliments || [];

    const ids = Array.from(new Set(items.map((a) => a.alimentId).filter(Boolean) as string[]));
    const names = Array.from(new Set(items.map((a) => a.name).filter(Boolean) as string[]));

    // Build prisma where clause depending on provided ids/names
    const or: any[] = [];
    if (ids.length > 0) or.push({ id: { in: ids } });
    // match names exactly (case-sensitive). If you prefer case-insensitive matching,
    // we can change to equals + mode: 'insensitive' per name.
    for (const n of names) or.push({ name: n });

    const dbAliments = or.length > 0 ? await prisma.aliment.findMany({ where: { OR: or } }) : [];
    const mapById: Record<string, any> = {};
    const mapByName: Record<string, any> = {};
    for (const d of dbAliments) {
      const anyd: any = d;
      if (anyd.id) mapById[anyd.id] = anyd;
      if (anyd.name) mapByName[anyd.name] = anyd;
    }

    for (const a of items) {
      const { alimentId, name, quantity } = a;
      // prefer id lookup, fall back to name lookup
      const dbAny = alimentId ? mapById[alimentId] : (name ? mapByName[name] : undefined);

      if (!dbAny) {
        warnings.push(`Aliment ${alimentId ?? name ?? '<unknown>'} not found in database`);
      }

      const resolvedName = dbAny?.name ?? name;
      const cal_100g = dbAny?.cal_100g;
      const protein_100g = dbAny?.protein_100g;
      const carbs_100g = dbAny?.carbs_100g;
      const fat_100g = dbAny?.fat_100g;

      const factor = (quantity ?? 0) / 100;

      const calories = cal_100g != null ? Math.round(cal_100g * factor) : 0;
      const protein = protein_100g != null ? Math.round(protein_100g * factor * 100) / 100 : 0;
      const carbs = carbs_100g != null ? Math.round(carbs_100g * factor * 100) / 100 : 0;
      const fat = fat_100g != null ? Math.round(fat_100g * factor * 100) / 100 : 0;

      if (cal_100g === undefined && protein_100g === undefined && carbs_100g === undefined && fat_100g === undefined) {
        warnings.push(`Missing nutrition data for aliment ${name ?? alimentId}`);
      }

      perAliment.push({ alimentId, name, quantity, calories, protein, carbs, fat });

      totalCalories += calories;
      totalProtein += protein;
      totalCarbs += carbs;
      totalFat += fat;
    }

    totalProtein = Math.round(totalProtein * 100) / 100;
    totalCarbs = Math.round(totalCarbs * 100) / 100;
    totalFat = Math.round(totalFat * 100) / 100;

    return {
      totalCalories,
      totalProtein,
      totalCarbs,
      totalFat,
      perAliment,
      warnings: warnings.length > 0 ? warnings : undefined,
    };
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
      console.log(`[DEBUG] getSuggestions called with filters:`, JSON.stringify(filters, null, 2));
      
      // Build where clause based on filters
      const whereClause: any = {};
      
      // Filter by excluded aliments
      if (filters.excludedAliments && filters.excludedAliments.length > 0) {
        try {
          whereClause.aliments = {
            none: {
              aliment: {
                name: {
                  in: filters.excludedAliments
                }
              }
            }
          };
        } catch (err) {
          console.error(`[ERROR] Error building excluded aliments filter:`, err);
          // Continue without this filter
        }
      }
      
      // Filter by available equipment
      // Note: We skip this filter for now to avoid filtering out all meals
      // This can be enhanced later to properly filter meals based on equipment
      // if (filters.availableEquipments && filters.availableEquipments.length > 0) {
      //   whereClause.equipments = {
      //     every: {
      //       equipmentId: {
      //         in: filters.availableEquipments
      //       }
      //     }
      //   };
      // }
      
      // Get all matching meals
      // If whereClause is empty, get all meals
      const where = Object.keys(whereClause).length > 0 ? whereClause : undefined;
      
      console.log(`[DEBUG] Querying meals with where clause:`, JSON.stringify(where, null, 2));
      
      let meals;
      try {
        meals = await prisma.meal.findMany({
          where: where,
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
        console.log(`[DEBUG] Prisma query successful, found ${meals.length} meals`);
      } catch (prismaError: any) {
        console.error(`[ERROR] Prisma query failed:`, prismaError);
        console.error(`[ERROR] Prisma error message:`, prismaError?.message);
        console.error(`[ERROR] Prisma error code:`, prismaError?.code);
        console.error(`[ERROR] Prisma error stack:`, prismaError?.stack);
        throw new Error(`Database query failed: ${prismaError?.message || 'Unknown error'}`);
      }
      
      console.log(`[DEBUG] Found ${meals.length} meals matching base filters`);
      
      if (meals.length === 0) {
        console.log(`[DEBUG] No meals found, returning empty array`);
        return [];
      }
      
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
      
      // Apply time filter (if no meals match, ignore the filter)
      let filteredMeals = enrichedMeals;
      if (filters.maxTime) {
        const timeFiltered = filteredMeals.filter(meal => meal.preparationTime <= filters.maxTime!);
        if (timeFiltered.length > 0) {
          filteredMeals = timeFiltered;
        } else {
          console.log(`[DEBUG] No meals match maxTime ${filters.maxTime}, ignoring time filter`);
          // Keep all meals but sort by preparation time (shorter first)
          filteredMeals.sort((a, b) => a.preparationTime - b.preparationTime);
        }
      }
      
      // Apply calorie filter (within 50% range - more flexible)
      // If no meals match, we'll relax the filter
      if (filters.targetCalories && filters.targetCalories > 0) {
        const tolerance = filters.targetCalories * 0.5; // Increased from 0.2 to 0.5 (50% tolerance)
        const strictFiltered = filteredMeals.filter(meal => {
          const mealCalories = meal.calories || 0;
          return Math.abs(mealCalories - filters.targetCalories!) <= tolerance;
        });
        
        // If strict filter returns results, use it; otherwise use all meals
        if (strictFiltered.length > 0) {
          filteredMeals = strictFiltered;
        } else {
          // If no meals match the calorie target, return all meals sorted by calorie proximity
          console.log(`[DEBUG] No meals match calorie target ${filters.targetCalories}, returning all meals sorted by proximity`);
          filteredMeals.sort((a, b) => {
            const diffA = Math.abs((a.calories || 0) - filters.targetCalories!);
            const diffB = Math.abs((b.calories || 0) - filters.targetCalories!);
            return diffA - diffB; // Closer to target first
          });
        }
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
      
      console.log(`[DEBUG] Final filtered meals: ${filteredMeals.length}, limit: ${filters.limit}`);
      
      const result = filteredMeals.slice(0, filters.limit);
      console.log(`[DEBUG] Returning ${result.length} suggestions`);
      
      return result;
    } catch (error: any) {
      console.error(`[ERROR] getSuggestions failed:`, error);
      console.error(`[ERROR] getSuggestions error message:`, error?.message);
      console.error(`[ERROR] getSuggestions error stack:`, error?.stack);
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
    
    if (!meal.aliments || !Array.isArray(meal.aliments)) {
      return { protein: 0, carbohydrates: 0, lipids: 0 };
    }
    
    meal.aliments.forEach((mealAliment: any) => {
      if (!mealAliment || !mealAliment.aliment) {
        return;
      }
      
      const quantity = mealAliment.quantity / 100; // Convert to 100g portions
      
      if (mealAliment.aliment.macros && Array.isArray(mealAliment.aliment.macros)) {
        mealAliment.aliment.macros.forEach((alimentMacro: any) => {
          if (!alimentMacro || !alimentMacro.macro) {
            return;
          }
          
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
      }
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

  /**
   * Get personalized meal suggestions based on user profile
   * This method uses the user's profile to automatically filter and score meals
   * 
   * @param userId - User ID
   * @param mealType - Optional meal type (BREAKFAST, LUNCH, DINNER, SNACK)
   * @param limit - Maximum number of suggestions to return
   * @returns Array of personalized meal suggestions
   */
  public async getPersonalizedSuggestions(
    userId: string,
    mealType?: MealType,
    limit: number = 10
  ): Promise<Meal[]> {
    console.log(`[DEBUG] getPersonalizedSuggestions: Starting for userId=${userId}`);
    
    const profileService = new UserProfileService();
    const profile = await profileService.getProfile(userId);
    
    if (!profile) {
      throw new Error(`Profile not found for userId=${userId}`);
    }

    // Get calculated needs
    const needs = await profileService.getCalculatedNeeds(userId);
    
    if (!needs) {
      throw new Error(`Could not calculate user needs for userId=${userId}`);
    }

    // Determine target calories for this meal type
    let targetCalories: number | undefined;
    if (mealType && needs.mealCalories) {
      switch (mealType) {
        case "BREAKFAST":
          targetCalories = needs.mealCalories.breakfast;
          break;
        case "LUNCH":
          targetCalories = needs.mealCalories.lunch;
          break;
        case "DINNER":
          targetCalories = needs.mealCalories.dinner;
          break;
        case "SNACK":
          targetCalories = needs.mealCalories.snack;
          break;
      }
    } else {
      // Use average if no meal type specified
      targetCalories = needs.targetCalories / (profile.mealsPerDay || 3);
    }
    
    // Ensure targetCalories is valid
    if (!targetCalories || targetCalories <= 0) {
      targetCalories = needs.targetCalories / (profile.mealsPerDay || 3);
    }

    // Build filters from profile
    const availableEquipments = Array.isArray(profile.availableEquipments) 
      ? profile.availableEquipments 
      : [];
    
    const filters: SuggestionFilters = {
      targetCalories,
      maxTime: profile.maxPrepTimePerMeal || undefined,
      excludedAliments: this.getExcludedAlimentsFromProfile(profile),
      availableEquipments: availableEquipments,
      preferredMacros: this.getPreferredMacroFromGoal(profile.goal),
      limit,
    };
    
    console.log(`[DEBUG] getPersonalizedSuggestions filters:`, {
      targetCalories,
      maxTime: filters.maxTime,
      excludedAlimentsCount: filters.excludedAliments?.length || 0,
      availableEquipmentsCount: filters.availableEquipments?.length || 0,
      preferredMacros: filters.preferredMacros,
      limit
    });

    // Get base suggestions using filters
    let suggestions: Meal[] = await this.getSuggestions(filters);

    if (suggestions.length === 0) {
      // If no suggestions match filters, return all meals sorted by relevance
      console.log(`[DEBUG] No suggestions match filters, returning all meals sorted by relevance`);
      const allMeals = await this.getAll();
      suggestions = allMeals;
    }
    
    console.log(`[DEBUG] Processing ${suggestions.length} suggestions through profile filters`);

    // Apply additional profile-based filters and scoring
    suggestions = this.applyProfileFilters(suggestions, profile, mealType);
    console.log(`[DEBUG] After profile filters: ${suggestions.length} suggestions`);

    // Sort by relevance score
    const scoredMeals = suggestions.map(meal => ({
      meal,
      score: this.calculateRelevanceScore(meal, profile, needs, mealType)
    }));

    if (scoredMeals.length === 0) {
      return [];
    }

    scoredMeals.sort((a, b) => b.score - a.score);

    // Add variety: shuffle meals with similar scores (within 10 points)
    // This ensures we don't always return the exact same meals
    const groupedMeals: Array<Array<{ meal: Meal; score: number }>> = [];
    let currentGroup: Array<{ meal: Meal; score: number }> = [];
    const firstMeal = scoredMeals[0];
    if (!firstMeal) {
      return [];
    }
    let currentScore = firstMeal.score;

    for (const scoredMeal of scoredMeals) {
      if (Math.abs(scoredMeal.score - currentScore) <= 10) {
        // Similar score, add to current group
        currentGroup.push(scoredMeal);
      } else {
        // Different score, start new group
        if (currentGroup.length > 0) {
          // Shuffle current group for variety
          for (let i = currentGroup.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            const temp = currentGroup[i];
            const swap = currentGroup[j];
            if (temp && swap) {
              currentGroup[i] = swap;
              currentGroup[j] = temp;
            }
          }
          groupedMeals.push(currentGroup);
        }
        currentGroup = [scoredMeal];
        currentScore = scoredMeal.score;
      }
    }
    if (currentGroup.length > 0) {
      // Shuffle last group
      for (let i = currentGroup.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = currentGroup[i];
        const swap = currentGroup[j];
        if (temp && swap) {
          currentGroup[i] = swap;
          currentGroup[j] = temp;
        }
      }
      groupedMeals.push(currentGroup);
    }

    // Flatten groups back to array
    const finalSuggestions = groupedMeals.flat().map(item => item.meal);

    return finalSuggestions.slice(0, limit);
  }

  /**
   * Get excluded aliments from profile (dietary restrictions, allergies, etc.)
   */
  private getExcludedAlimentsFromProfile(profile: any): string[] {
    const excluded: string[] = [];

    // Add explicitly excluded aliments
    if (profile.excludedAliments && Array.isArray(profile.excludedAliments)) {
      excluded.push(...profile.excludedAliments);
    }

    // Add disliked foods
    if (profile.dislikedFoods && Array.isArray(profile.dislikedFoods)) {
      excluded.push(...profile.dislikedFoods);
    }

    // TODO: Add aliments based on dietary restrictions (vegetarian, vegan, etc.)
    // This would require a mapping of restrictions to aliments

    // TODO: Add aliments based on allergies
    // This would require a mapping of allergies to aliments

    return [...new Set(excluded)]; // Remove duplicates
  }

  /**
   * Get preferred macro from goal
   */
  private getPreferredMacroFromGoal(goal: string | null | undefined): string | undefined {
    if (!goal) return undefined;

    switch (goal) {
      case "BUILD_MUSCLE":
      case "STRENGTH_GAIN":
        return "protein";
      case "FAT_LOSS":
        return "protein";
      case "ENDURANCE":
        return "carbohydrates";
      default:
        return undefined;
    }
  }

  /**
   * Apply additional profile-based filters
   */
  private applyProfileFilters(
    meals: Meal[],
    profile: any,
    mealType?: MealType
  ): Meal[] {
    return meals.filter((meal) => {
      // Filter by meal type prep time if specified
      if (mealType) {
        const prepTimeLimit = this.getPrepTimeForMealType(profile, mealType);
        if (prepTimeLimit) {
          const mealPrepTime = this.calculateMealPrepTime(meal);
          if (mealPrepTime > prepTimeLimit) {
            return false;
          }
        }
      }

      // Filter by complexity if specified
      if (profile.complexityPreference) {
        const mealComplexity = this.estimateMealComplexity(meal);
        if (!this.matchesComplexity(mealComplexity, profile.complexityPreference)) {
          return false;
        }
      }

      // Filter by cooking methods if specified
      if (profile.preferredCookingMethods && profile.preferredCookingMethods.length > 0) {
        // This would require meal cooking method data
        // For now, we'll skip this filter
      }

      // Filter by budget if specified
      if (profile.budgetPerMeal) {
        // This would require meal cost data
        // For now, we'll skip this filter
      }

      return true;
    });
  }

  /**
   * Get prep time limit for specific meal type
   */
  private getPrepTimeForMealType(profile: any, mealType: MealType): number | null {
    switch (mealType) {
      case "BREAKFAST":
        return profile.breakfastPrepTime || profile.maxPrepTimePerMeal || null;
      case "LUNCH":
        return profile.lunchPrepTime || profile.maxPrepTimePerMeal || null;
      case "DINNER":
        return profile.dinnerPrepTime || profile.maxPrepTimePerMeal || null;
      case "SNACK":
        return profile.snackPrepTime || profile.maxPrepTimePerMeal || null;
      default:
        return profile.maxPrepTimePerMeal || null;
    }
  }

  /**
   * Calculate meal preparation time
   */
  private calculateMealPrepTime(meal: any): number {
    if (!meal.preparations || !Array.isArray(meal.preparations)) {
      return 0;
    }
    return meal.preparations.reduce(
      (sum: number, prep: any) => sum + (prep.preparation?.estimated_time || 0),
      0
    );
  }

  /**
   * Estimate meal complexity
   */
  private estimateMealComplexity(meal: any): string {
    const ingredientCount = meal.aliments?.length || 0;
    const prepStepCount = meal.preparations?.length || 0;

    if (ingredientCount <= 3 && prepStepCount <= 2) {
      return "SIMPLE";
    } else if (ingredientCount <= 7 && prepStepCount <= 5) {
      return "MODERATE";
    } else {
      return "COMPLEX";
    }
  }

  /**
   * Check if meal complexity matches preference
   */
  private matchesComplexity(mealComplexity: string, preference: string): boolean {
    if (preference === "SIMPLE") {
      return mealComplexity === "SIMPLE";
    } else if (preference === "MODERATE") {
      return mealComplexity === "SIMPLE" || mealComplexity === "MODERATE";
    } else {
      return true; // COMPLEX accepts all
    }
  }

  /**
   * Calculate relevance score for a meal based on profile
   */
  private calculateRelevanceScore(
    meal: any,
    profile: any,
    needs: any,
    mealType?: MealType
  ): number {
    let score = 100;

    try {
      // Calculate nutrition
      const nutrition = this.calculateMealNutrition(meal);
      const mealPrepTime = this.calculateMealPrepTime(meal);

    // Score based on calorie match
    if (mealType && needs.mealCalories) {
      let targetCalories: number | undefined;
      switch (mealType) {
        case "BREAKFAST":
          targetCalories = needs.mealCalories.breakfast;
          break;
        case "LUNCH":
          targetCalories = needs.mealCalories.lunch;
          break;
        case "DINNER":
          targetCalories = needs.mealCalories.dinner;
          break;
        case "SNACK":
          targetCalories = needs.mealCalories.snack;
          break;
      }

      if (targetCalories && targetCalories > 0) {
        const calorieDiff = Math.abs(meal.calories - targetCalories);
        const caloriePercentDiff = (calorieDiff / targetCalories) * 100;

        if (caloriePercentDiff <= 5) {
          score += 20;
        } else if (caloriePercentDiff <= 10) {
          score += 10;
        } else if (caloriePercentDiff > 15) {
          score -= 30;
        }
      }
    }

    // Score based on prep time
    const maxTime = profile.maxPrepTimePerMeal;
    if (maxTime) {
      if (mealPrepTime <= maxTime) {
        score += 10;
      } else {
        score -= 20;
      }
    }

    // Score based on preferred macro
    const preferredMacro = this.getPreferredMacroFromGoal(profile.goal);
    if (preferredMacro) {
      const macroScore = this.getMacroScore(nutrition, preferredMacro);
      score += macroScore * 0.1; // Small bonus for preferred macro
    }

    // Score based on liked meals
    if (profile.likedMeals && profile.likedMeals.includes(meal.id)) {
      score += 15;
    }

    // Penalty for disliked meals
    if (profile.dislikedMeals && profile.dislikedMeals.includes(meal.id)) {
      score -= 50;
    }

    return score;
    } catch (error) {
      console.error(`[ERROR] Error in calculateRelevanceScore:`, error);
      return 50; // Return default score on error
    }
  }
}
