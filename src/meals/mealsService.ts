import type { Meal, PaginatedMeals, MealListParams } from "./meal";
import { prisma } from "../shared/prisma";

export type MealCreationParams = Omit<
  Meal,
  "id" | "createdAt" | "updatedAt" | "aliments" | "preparations" | "equipements"
> & {
  aliments?: { alimentId: string; quantity: number }[];
  preparations?: { preparationId: string; order: number }[];
  equipements?: { equipmentId: string }[];
};

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
}
