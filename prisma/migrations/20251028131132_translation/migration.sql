/*
  Warnings:

  - You are about to drop the `equipements` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `meal_equipements` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `quantite` on the `aliment_macros` table. All the data in the column will be lost.
  - You are about to drop the column `nom` on the `aliments` table. All the data in the column will be lost.
  - You are about to drop the column `nom` on the `macros` table. All the data in the column will be lost.
  - You are about to drop the column `quantite` on the `meal_aliments` table. All the data in the column will be lost.
  - You are about to drop the column `ordre` on the `meal_preparations` table. All the data in the column will be lost.
  - You are about to drop the column `etape` on the `preparations` table. All the data in the column will be lost.
  - You are about to drop the column `temps_estime` on the `preparations` table. All the data in the column will be lost.
  - Added the required column `quantity` to the `aliment_macros` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `aliments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `macros` table without a default value. This is not possible if the table is not empty.
  - Added the required column `quantity` to the `meal_aliments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `order` to the `meal_preparations` table without a default value. This is not possible if the table is not empty.
  - Added the required column `estimed_time` to the `preparations` table without a default value. This is not possible if the table is not empty.
  - Added the required column `step` to the `preparations` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "equipements_nom_key";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "equipements";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "meal_equipements";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "equipments" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "meal_equipments" (
    "mealId" TEXT NOT NULL,
    "equipmentId" TEXT NOT NULL,

    PRIMARY KEY ("mealId", "equipmentId"),
    CONSTRAINT "meal_equipments_mealId_fkey" FOREIGN KEY ("mealId") REFERENCES "meals" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "meal_equipments_equipmentId_fkey" FOREIGN KEY ("equipmentId") REFERENCES "equipments" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_aliment_macros" (
    "alimentId" TEXT NOT NULL,
    "macroId" TEXT NOT NULL,
    "quantity" REAL NOT NULL,

    PRIMARY KEY ("alimentId", "macroId"),
    CONSTRAINT "aliment_macros_alimentId_fkey" FOREIGN KEY ("alimentId") REFERENCES "aliments" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "aliment_macros_macroId_fkey" FOREIGN KEY ("macroId") REFERENCES "macros" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_aliment_macros" ("alimentId", "macroId") SELECT "alimentId", "macroId" FROM "aliment_macros";
DROP TABLE "aliment_macros";
ALTER TABLE "new_aliment_macros" RENAME TO "aliment_macros";
CREATE TABLE "new_aliments" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "cal_100g" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_aliments" ("cal_100g", "createdAt", "id", "updatedAt") SELECT "cal_100g", "createdAt", "id", "updatedAt" FROM "aliments";
DROP TABLE "aliments";
ALTER TABLE "new_aliments" RENAME TO "aliments";
CREATE UNIQUE INDEX "aliments_name_key" ON "aliments"("name");
CREATE TABLE "new_macros" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL
);
INSERT INTO "new_macros" ("id") SELECT "id" FROM "macros";
DROP TABLE "macros";
ALTER TABLE "new_macros" RENAME TO "macros";
CREATE UNIQUE INDEX "macros_name_key" ON "macros"("name");
CREATE TABLE "new_meal_aliments" (
    "mealId" TEXT NOT NULL,
    "alimentId" TEXT NOT NULL,
    "quantity" REAL NOT NULL,

    PRIMARY KEY ("mealId", "alimentId"),
    CONSTRAINT "meal_aliments_mealId_fkey" FOREIGN KEY ("mealId") REFERENCES "meals" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "meal_aliments_alimentId_fkey" FOREIGN KEY ("alimentId") REFERENCES "aliments" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_meal_aliments" ("alimentId", "mealId") SELECT "alimentId", "mealId" FROM "meal_aliments";
DROP TABLE "meal_aliments";
ALTER TABLE "new_meal_aliments" RENAME TO "meal_aliments";
CREATE TABLE "new_meal_preparations" (
    "mealId" TEXT NOT NULL,
    "preparationId" TEXT NOT NULL,
    "order" INTEGER NOT NULL,

    PRIMARY KEY ("mealId", "preparationId"),
    CONSTRAINT "meal_preparations_mealId_fkey" FOREIGN KEY ("mealId") REFERENCES "meals" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "meal_preparations_preparationId_fkey" FOREIGN KEY ("preparationId") REFERENCES "preparations" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_meal_preparations" ("mealId", "preparationId") SELECT "mealId", "preparationId" FROM "meal_preparations";
DROP TABLE "meal_preparations";
ALTER TABLE "new_meal_preparations" RENAME TO "meal_preparations";
CREATE TABLE "new_preparations" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "step" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "estimed_time" INTEGER NOT NULL
);
INSERT INTO "new_preparations" ("description", "id") SELECT "description", "id" FROM "preparations";
DROP TABLE "preparations";
ALTER TABLE "new_preparations" RENAME TO "preparations";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "equipments_name_key" ON "equipments"("name");
