/*
  Warnings:

  - You are about to drop the column `estimed_time` on the `preparations` table. All the data in the column will be lost.
  - Added the required column `estimated_time` to the `preparations` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_preparations" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "step" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "estimated_time" INTEGER NOT NULL
);
INSERT INTO "new_preparations" ("description", "id", "step") SELECT "description", "id", "step" FROM "preparations";
DROP TABLE "preparations";
ALTER TABLE "new_preparations" RENAME TO "preparations";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
