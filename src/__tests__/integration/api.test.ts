/**
 * Integration tests for API endpoints
 * These tests require a running server and test database
 */

import { app } from "../../app";
import request from "supertest";

const API_KEY = process.env.API_KEY || "test-api-key";

describe("API Integration Tests", () => {
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
  });
});

