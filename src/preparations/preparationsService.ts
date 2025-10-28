import type { Preparation } from "./preparation";
import { prisma } from "../shared/prisma";

export type PreparationCreationParams = Omit<
  Preparation,
  "id" | "meals"
>;

export class PreparationsService {
  public async get(id: string): Promise<Preparation | null> {
    const preparation = await prisma.preparation.findUnique({
      where: { id },
      include: {
        meals: {
          include: {
            meal: true,
          },
          orderBy: {
            order: "asc",
          },
        },
      },
    });

    return preparation;
  }

  public async getAll(): Promise<Preparation[]> {
    const preparations = await prisma.preparation.findMany({
      include: {
        meals: {
          include: {
            meal: true,
          },
          orderBy: {
            order: "asc",
          },
        },
      },
      orderBy: {
        step: "asc",
      },
    });

    return preparations;
  }

  public async create(preparationCreationParams: PreparationCreationParams): Promise<Preparation> {
    const preparation = await prisma.preparation.create({
      data: preparationCreationParams,
      include: {
        meals: {
          include: {
            meal: true,
          },
          orderBy: {
            order: "asc",
          },
        },
      },
    });

    return preparation;
  }

  public async update(
    id: string,
    preparationUpdateParams: Partial<PreparationCreationParams>
  ): Promise<Preparation | null> {
    const updatedPreparation = await prisma.preparation.update({
      where: { id },
      data: preparationUpdateParams,
      include: {
        meals: {
          include: {
            meal: true,
          },
          orderBy: {
            order: "asc",
          },
        },
      },
    });

    return updatedPreparation;
  }

  public async delete(id: string): Promise<boolean> {
    try {
      await prisma.preparation.delete({
        where: { id },
      });
      return true;
    } catch (error) {
      return false;
    }
  }
}