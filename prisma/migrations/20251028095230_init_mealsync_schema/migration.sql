-- CreateTable
CREATE TABLE "meals" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "titre" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "calories" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "equipements" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nom" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "preparations" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "etape" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "temps_estime" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "aliments" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nom" TEXT NOT NULL,
    "cal_100g" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "macros" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nom" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "meal_aliments" (
    "mealId" TEXT NOT NULL,
    "alimentId" TEXT NOT NULL,
    "quantite" REAL NOT NULL,

    PRIMARY KEY ("mealId", "alimentId"),
    CONSTRAINT "meal_aliments_mealId_fkey" FOREIGN KEY ("mealId") REFERENCES "meals" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "meal_aliments_alimentId_fkey" FOREIGN KEY ("alimentId") REFERENCES "aliments" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "meal_preparations" (
    "mealId" TEXT NOT NULL,
    "preparationId" TEXT NOT NULL,
    "ordre" INTEGER NOT NULL,

    PRIMARY KEY ("mealId", "preparationId"),
    CONSTRAINT "meal_preparations_mealId_fkey" FOREIGN KEY ("mealId") REFERENCES "meals" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "meal_preparations_preparationId_fkey" FOREIGN KEY ("preparationId") REFERENCES "preparations" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "meal_equipements" (
    "mealId" TEXT NOT NULL,
    "equipmentId" TEXT NOT NULL,

    PRIMARY KEY ("mealId", "equipmentId"),
    CONSTRAINT "meal_equipements_mealId_fkey" FOREIGN KEY ("mealId") REFERENCES "meals" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "meal_equipements_equipmentId_fkey" FOREIGN KEY ("equipmentId") REFERENCES "equipements" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "aliment_macros" (
    "alimentId" TEXT NOT NULL,
    "macroId" TEXT NOT NULL,
    "quantite" REAL NOT NULL,

    PRIMARY KEY ("alimentId", "macroId"),
    CONSTRAINT "aliment_macros_alimentId_fkey" FOREIGN KEY ("alimentId") REFERENCES "aliments" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "aliment_macros_macroId_fkey" FOREIGN KEY ("macroId") REFERENCES "macros" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "equipements_nom_key" ON "equipements"("nom");

-- CreateIndex
CREATE UNIQUE INDEX "aliments_nom_key" ON "aliments"("nom");

-- CreateIndex
CREATE UNIQUE INDEX "macros_nom_key" ON "macros"("nom");
