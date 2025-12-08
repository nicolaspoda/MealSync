import type { Macro } from "./macro";
import { prisma } from "../shared/prisma";

export type MacroCreationParams = Omit<
  Macro,
  "id" | "aliments"
>;

export class MacrosService {
  public async get(id: string): Promise<Macro | null> {
    const macro = await prisma.macro.findUnique({
      where: { id },
      include: {
        aliments: {
          include: {
            aliment: true,
          },
        },
      },
    });

    return macro;
  }

  public async getAll(): Promise<Macro[]> {
    const macros = await prisma.macro.findMany({
      include: {
        aliments: {
          include: {
            aliment: true,
          },
        },
      },
      orderBy: {
        name: "asc",
      },
    });

    return macros;
  }

  public async create(macroCreationParams: MacroCreationParams): Promise<Macro> {
    const macro = await prisma.macro.create({
      data: macroCreationParams,
      include: {
        aliments: {
          include: {
            aliment: true,
          },
        },
      },
    });

    return macro;
  }

  public async update(
    id: string,
    macroUpdateParams: Partial<MacroCreationParams>
  ): Promise<Macro | null> {
    const updatedMacro = await prisma.macro.update({
      where: { id },
      data: macroUpdateParams,
      include: {
        aliments: {
          include: {
            aliment: true,
          },
        },
      },
    });

    return updatedMacro;
  }

  public async delete(id: string): Promise<void> {
    try {
      await prisma.macro.delete({
        where: { id },
      });
    } catch (error) {
      throw new Error(`Failed to delete macro with id ${id}`);
    }
  }
}