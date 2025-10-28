/*
  Warnings:

  - You are about to drop the column `created_at` on the `api_key` table. All the data in the column will be lost.
  - You are about to drop the column `expires_at` on the `api_key` table. All the data in the column will be lost.
  - You are about to drop the column `is_active` on the `api_key` table. All the data in the column will be lost.
  - You are about to drop the column `last_used_at` on the `api_key` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_api_key" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "keyHash" TEXT NOT NULL,
    "name" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastUsedAt" DATETIME,
    "expiresAt" DATETIME,
    "isActive" BOOLEAN NOT NULL DEFAULT true
);
INSERT INTO "new_api_key" ("id", "keyHash", "name") SELECT "id", "keyHash", "name" FROM "api_key";
DROP TABLE "api_key";
ALTER TABLE "new_api_key" RENAME TO "api_key";
CREATE UNIQUE INDEX "api_key_keyHash_key" ON "api_key"("keyHash");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
