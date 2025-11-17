import { AlimentsService } from "../alimentsService";
import { prisma } from "../../shared/prisma";

// Mock Prisma
jest.mock("../../shared/prisma", () => ({
  prisma: {
    aliment: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    alimentMacro: {
      deleteMany: jest.fn(),
      createMany: jest.fn(),
    },
  },
}));

describe("AlimentsService", () => {
  let service: AlimentsService;

  beforeEach(() => {
    service = new AlimentsService();
    jest.clearAllMocks();
  });

  describe("getAll", () => {
    it("should return all aliments", async () => {
      const mockAliments = [
        {
          id: "1",
          name: "Poulet",
          cal_100g: 165,
          createdAt: new Date(),
          updatedAt: new Date(),
          meals: [],
          macros: [],
        },
      ];

      (prisma.aliment.findMany as jest.Mock).mockResolvedValue(mockAliments);

      const result = await service.getAll();

      expect(result).toEqual(mockAliments);
      expect(prisma.aliment.findMany).toHaveBeenCalledTimes(1);
    });
  });

  describe("get", () => {
    it("should return an aliment by id", async () => {
      const mockAliment = {
        id: "1",
        name: "Poulet",
        cal_100g: 165,
        createdAt: new Date(),
        updatedAt: new Date(),
        meals: [],
        macros: [],
      };

      (prisma.aliment.findUnique as jest.Mock).mockResolvedValue(mockAliment);

      const result = await service.get("1");

      expect(result).toEqual(mockAliment);
      expect(prisma.aliment.findUnique).toHaveBeenCalledWith({
        where: { id: "1" },
        include: expect.any(Object),
      });
    });

    it("should return null if aliment not found", async () => {
      (prisma.aliment.findUnique as jest.Mock).mockResolvedValue(null);

      const result = await service.get("non-existent");

      expect(result).toBeNull();
    });
  });

  describe("create", () => {
    it("should create a new aliment", async () => {
      const creationParams = {
        name: "Poulet",
        cal_100g: 165,
      };

      const mockCreatedAliment = {
        id: "1",
        ...creationParams,
        createdAt: new Date(),
        updatedAt: new Date(),
        meals: [],
        macros: [],
      };

      (prisma.aliment.create as jest.Mock).mockResolvedValue(mockCreatedAliment);

      const result = await service.create(creationParams);

      expect(result).toEqual(mockCreatedAliment);
      expect(prisma.aliment.create).toHaveBeenCalledWith({
        data: creationParams,
        include: expect.any(Object),
      });
    });
  });

  describe("update", () => {
    it("should update an existing aliment", async () => {
      const updateParams = {
        name: "Poulet grillé",
        cal_100g: 170,
      };

      const mockUpdatedAliment = {
        id: "1",
        ...updateParams,
        createdAt: new Date(),
        updatedAt: new Date(),
        meals: [],
        macros: [],
      };

      (prisma.aliment.update as jest.Mock).mockResolvedValue(mockUpdatedAliment);
      (prisma.aliment.findUnique as jest.Mock).mockResolvedValue(mockUpdatedAliment);

      const result = await service.update("1", updateParams);

      expect(result).toEqual(mockUpdatedAliment);
      expect(prisma.aliment.update).toHaveBeenCalledWith({
        where: { id: "1" },
        data: updateParams,
        include: expect.any(Object),
      });
    });
  });

  describe("delete", () => {
    it("should delete an aliment and return true", async () => {
      (prisma.aliment.delete as jest.Mock).mockResolvedValue({});

      const result = await service.delete("1");

      expect(result).toBe(true);
      expect(prisma.aliment.delete).toHaveBeenCalledWith({
        where: { id: "1" },
      });
    });

    it("should return false if deletion fails", async () => {
      (prisma.aliment.delete as jest.Mock).mockRejectedValue(new Error("Delete failed"));

      const result = await service.delete("1");

      expect(result).toBe(false);
    });
  });
});

