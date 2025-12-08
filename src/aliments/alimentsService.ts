import type { Aliment } from "./aliment";
import { prisma } from "../shared/prisma";

export type AlimentCreationParams = Omit<
  Aliment,
  "id" | "createdAt" | "updatedAt" | "meals" | "macros"
> & {
  macros?: { macroId: string; quantity: number }[];
};

export class AlimentsService {
  public async get(id: string): Promise<Aliment | null> {
    const aliment = await prisma.aliment.findUnique({
      where: { id },
      include: {
        meals: {
          include: {
            meal: true,
          },
        },
        macros: {
          include: {
            macro: true,
          },
        },
      },
    });

    return aliment;
  }

  public async getAll(): Promise<Aliment[]> {
    const aliments = await prisma.aliment.findMany({
      include: {
        meals: {
          include: {
            meal: true,
          },
        },
        macros: {
          include: {
            macro: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return aliments;
  }

  public async create(alimentCreationParams: AlimentCreationParams): Promise<Aliment> {
    const { macros = [], ...alimentData } = alimentCreationParams;

    const aliment = await prisma.aliment.create({
      data: {
        ...alimentData,
        macros: {
          create: macros.map((macro) => ({
            macroId: macro.macroId,
            quantity: macro.quantity,
          })),
        },
      },
      include: {
        meals: {
          include: {
            meal: true,
          },
        },
        macros: {
          include: {
            macro: true,
          },
        },
      },
    });

    return aliment;
  }

  public async update(
    id: string,
    alimentUpdateParams: Partial<AlimentCreationParams>
  ): Promise<Aliment | null> {
    const { macros, ...alimentData } = alimentUpdateParams;

    const updatedAliment = await prisma.aliment.update({
      where: { id },
      data: alimentData,
      include: {
        meals: {
          include: {
            meal: true,
          },
        },
        macros: {
          include: {
            macro: true,
          },
        },
      },
    });

    if (macros !== undefined) {
      await prisma.alimentMacro.deleteMany({ where: { alimentId: id } });
      if (macros.length > 0) {
        await prisma.alimentMacro.createMany({
          data: macros.map((macro) => ({
            alimentId: id,
            macroId: macro.macroId,
            quantity: macro.quantity,
          })),
        });
      }
    }

    return this.get(id);
  }

  public async delete(id: string): Promise<void> {
    try {
      await prisma.aliment.delete({
        where: { id },
      });
    } catch (error) {
      throw new Error(`Failed to delete aliment with id ${id}`);
    }
  }
}