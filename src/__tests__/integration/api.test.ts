/**
 * Integration tests for API endpoints
 * These tests require a running server and test database
 */

import { app } from "../../app";
import request from "supertest";
import { UserProfileService } from "../../users/userProfileService";
import { prisma } from "../../shared/prisma";

const API_KEY = process.env.API_KEY || "test-api-key";
const userProfileService = new UserProfileService();
let profileUserId: string | undefined;

describe("API Integration Tests", () => {
  beforeAll(async () => {
    const user = await userProfileService.createUser({
      email: `integration-${Date.now()}@mealsync.dev`,
      username: "integration-profile",
    });

    profileUserId = user.id;

    await userProfileService.createOrUpdateProfile(user.id, {
      gender: "MALE",
      birthDate: new Date("1990-01-01T00:00:00.000Z"),
      height: 180,
      weight: 80,
      activityLevel: "MODERATELY_ACTIVE",
      goal: "MAINTAIN_WEIGHT",
      mealsPerDay: 3,
      targetCalories: 2100,
      excludedAliments: ["Saumon"],
    });
  });

  afterAll(async () => {
    if (profileUserId) {
      try {
        await prisma.user.delete({
          where: { id: profileUserId },
        });
      } catch (error) {
        // ignore cleanup errors
      }
    }

    await prisma.$disconnect();
  });

  describe("GET /aliments", () => {
    it("should return 401 without API key", async () => {
      const response = await request(app).get("/aliments");
      expect(response.status).toBe(401);
    });

    it("should return 200 with valid API key", async () => {
      const response = await request(app)
        .get("/aliments")
        .set("x-api-key", API_KEY);
      
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe("POST /aliments", () => {
    it("should create a new aliment with valid data", async () => {
      const newAliment = {
        name: "Test Aliment",
        cal_100g: 100,
      };

      const response = await request(app)
        .post("/aliments")
        .set("x-api-key", API_KEY)
        .send(newAliment);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty("id");
      expect(response.body.name).toBe(newAliment.name);
    });

    it("should return 422 with invalid data", async () => {
      const invalidAliment = {
        name: "A", // Too short (minLength: 2)
        cal_100g: -10, // Negative value
      };

      const response = await request(app)
        .post("/aliments")
        .set("x-api-key", API_KEY)
        .send(invalidAliment);

      expect(response.status).toBe(422);
    });
  });

  describe("GET /meals", () => {
    it("should return list of meals", async () => {
      const response = await request(app)
        .get("/meals")
        .set("x-api-key", API_KEY);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe("POST /meal-plans/generate", () => {
    it("should generate a meal plan with valid parameters", async () => {
      const planParams = {
        objectives: {
          targetCalories: 2000,
        },
        constraints: {
          mealsPerDay: 3,
        },
      };

      const response = await request(app)
        .post("/meal-plans/generate")
        .set("x-api-key", API_KEY)
        .send(planParams);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty("dailyPlan");
      expect(response.body.dailyPlan).toHaveProperty("meals");
    });

    it("should generate a meal plan using a stored user profile", async () => {
      expect(profileUserId).toBeDefined();

      const response = await request(app)
        .post("/meal-plans/generate")
        .set("x-api-key", API_KEY)
        .send({
          userId: profileUserId,
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty("dailyPlan");
      expect(Array.isArray(response.body.dailyPlan.meals)).toBe(true);
      expect(response.body.dailyPlan.meals.length).toBeGreaterThan(0);
    });

    it("should return a clear error when constraints remove all meals", async () => {
      expect(profileUserId).toBeDefined();

      const response = await request(app)
        .post("/meal-plans/generate")
        .set("x-api-key", API_KEY)
        .send({
          userId: profileUserId,
          constraints: {
            maxPreparationTime: 5,
          },
        });

      expect(response.status).toBe(422);
      expect(response.body).toMatchObject({
        message: "Aucun repas ne respecte le temps de préparation maximum demandé",
        details: { maxPreparationTime: 5 },
      });
    });
  });
});

