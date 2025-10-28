/*
  Warnings:

  - You are about to drop the `ApiKey` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "ApiKey";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "api_key" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "keyHash" TEXT NOT NULL,
    "name" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_used_at" DATETIME,
    "expires_at" DATETIME,
    "is_active" BOOLEAN NOT NULL DEFAULT true
);

-- CreateIndex
CREATE UNIQUE INDEX "api_key_keyHash_key" ON "api_key"("keyHash");
