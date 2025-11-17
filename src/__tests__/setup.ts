// Test setup file
// This file runs before all tests

// Set test environment variables
process.env.NODE_ENV = "test";
process.env.DATABASE_URL = "file:./prisma/test.db";
process.env.API_KEY = "test-api-key";
process.env.PORT = "3001";

