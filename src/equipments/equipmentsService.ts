import type { Equipment } from "./equipment";
import { prisma } from "../shared/prisma";

export type EquipmentCreationParams = Omit<
  Equipment,
  "id" | "meals"
>;

export class EquipmentsService {
  public async get(id: string): Promise<Equipment | null> {
    const equipment = await prisma.equipment.findUnique({
      where: { id },
      include: {
        meals: {
          include: {
            meal: true,
          },
        },
      },
    });

    return equipment;
  }

  public async getAll(): Promise<Equipment[]> {
    const equipments = await prisma.equipment.findMany({
      include: {
        meals: {
          include: {
            meal: true,
          },
        },
      },
      orderBy: {
        name: "asc",
      },
    });

    return equipments;
  }

  public async create(equipmentCreationParams: EquipmentCreationParams): Promise<Equipment> {
    const equipment = await prisma.equipment.create({
      data: equipmentCreationParams,
      include: {
        meals: {
          include: {
            meal: true,
          },
        },
      },
    });

    return equipment;
  }

  public async update(
    id: string,
    equipmentUpdateParams: Partial<EquipmentCreationParams>
  ): Promise<Equipment | null> {
    const updatedEquipment = await prisma.equipment.update({
      where: { id },
      data: equipmentUpdateParams,
      include: {
        meals: {
          include: {
            meal: true,
          },
        },
      },
    });

    return updatedEquipment;
  }

  public async delete(id: string): Promise<boolean> {
    try {
      await prisma.equipment.delete({
        where: { id },
      });
      return true;
    } catch (error) {
      return false;
    }
  }
}