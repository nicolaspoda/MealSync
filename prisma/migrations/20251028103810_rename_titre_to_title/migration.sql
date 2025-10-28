/*
  Warnings:

  - You are about to drop the column `titre` on the `meals` table. All the data in the column will be lost.
  - Added the required column `title` to the `meals` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_meals" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "calories" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_meals" ("calories", "createdAt", "description", "id", "updatedAt") SELECT "calories", "createdAt", "description", "id", "updatedAt" FROM "meals";
DROP TABLE "meals";
ALTER TABLE "new_meals" RENAME TO "meals";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
