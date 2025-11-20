-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "username" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "user_profiles" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "gender" TEXT,
    "birthDate" DATETIME,
    "height" REAL,
    "weight" REAL,
    "targetWeight" REAL,
    "bodyFatPercentage" REAL,
    "leanMass" REAL,
    "fatMass" REAL,
    "waistCircumference" REAL,
    "hipCircumference" REAL,
    "neckCircumference" REAL,
    "bmr" REAL,
    "tdee" REAL,
    "bmi" REAL,
    "measuredBMR" REAL,
    "metabolicFactor" REAL,
    "healthStatus" TEXT,
    "isPregnant" BOOLEAN NOT NULL DEFAULT false,
    "pregnancyTrimester" INTEGER,
    "isLactating" BOOLEAN NOT NULL DEFAULT false,
    "lactationMonths" INTEGER,
    "activityLevel" TEXT,
    "exerciseType" TEXT,
    "exerciseFrequency" INTEGER,
    "exerciseMinutes" INTEGER,
    "exerciseIntensity" TEXT,
    "trainingGoal" TEXT,
    "workType" TEXT,
    "workHoursPerDay" INTEGER,
    "sleepHours" INTEGER,
    "sleepQuality" TEXT,
    "stressLevel" TEXT,
    "isSmoker" BOOLEAN NOT NULL DEFAULT false,
    "cigarettesPerDay" INTEGER,
    "alcoholConsumption" TEXT,
    "alcoholDrinksPerWeek" INTEGER,
    "goal" TEXT,
    "targetCalories" INTEGER,
    "calorieDeficit" INTEGER,
    "calorieSurplus" INTEGER,
    "weightChangeRate" TEXT,
    "targetBodyFat" REAL,
    "targetLeanMass" REAL,
    "targetWaist" REAL,
    "performanceGoals" TEXT,
    "mealsPerDay" INTEGER NOT NULL DEFAULT 3,
    "snacksPerDay" INTEGER NOT NULL DEFAULT 0,
    "intermittentFasting" TEXT,
    "fastingWindowStart" TEXT,
    "fastingWindowEnd" TEXT,
    "availableEquipments" TEXT NOT NULL DEFAULT '[]',
    "kitchenSize" TEXT,
    "cookingSkill" TEXT,
    "masteredTechniques" TEXT NOT NULL DEFAULT '[]',
    "hasMobilityIssues" BOOLEAN NOT NULL DEFAULT false,
    "physicalLimitations" TEXT,
    "needsCookingHelp" BOOLEAN NOT NULL DEFAULT false,
    "maxPrepTimePerMeal" INTEGER,
    "maxPrepTimePerDay" INTEGER,
    "breakfastPrepTime" INTEGER,
    "lunchPrepTime" INTEGER,
    "dinnerPrepTime" INTEGER,
    "snackPrepTime" INTEGER,
    "availableDays" TEXT NOT NULL DEFAULT '[]',
    "availableHours" TEXT,
    "mealPrepPreference" BOOLEAN NOT NULL DEFAULT false,
    "mealPrepDays" TEXT NOT NULL DEFAULT '[]',
    "budgetPerMeal" REAL,
    "budgetPerDay" REAL,
    "budgetPerWeek" REAL,
    "budgetPerMonth" REAL,
    "currency" TEXT NOT NULL DEFAULT 'EUR',
    "pricePreference" TEXT,
    "optimizeForCost" BOOLEAN NOT NULL DEFAULT false,
    "acceptCheaperAlternatives" BOOLEAN NOT NULL DEFAULT true,
    "preferredCookingMethods" TEXT NOT NULL DEFAULT '[]',
    "avoidedCookingMethods" TEXT NOT NULL DEFAULT '[]',
    "complexityPreference" TEXT,
    "maxSteps" INTEGER,
    "batchCooking" BOOLEAN NOT NULL DEFAULT false,
    "batchPortions" INTEGER,
    "storageDays" INTEGER,
    "acceptsFreezing" BOOLEAN NOT NULL DEFAULT true,
    "macroRatio" TEXT,
    "proteinTarget" REAL,
    "carbTarget" REAL,
    "fatTarget" REAL,
    "fiberTarget" REAL,
    "micronutrientFocus" TEXT NOT NULL DEFAULT '[]',
    "prefersWholeFoods" BOOLEAN NOT NULL DEFAULT false,
    "prefersOrganic" BOOLEAN NOT NULL DEFAULT false,
    "prefersMinimallyProcessed" BOOLEAN NOT NULL DEFAULT false,
    "takesSupplements" BOOLEAN NOT NULL DEFAULT false,
    "supplementsList" TEXT,
    "medicalConditions" TEXT NOT NULL DEFAULT '[]',
    "medications" TEXT,
    "medicationInteractions" TEXT,
    "sodiumLimit" INTEGER,
    "potassiumLimit" INTEGER,
    "phosphorusLimit" INTEGER,
    "proteinLimit" INTEGER,
    "fluidLimit" INTEGER,
    "fiberLimit" INTEGER,
    "recentSurgeries" TEXT,
    "postSurgeryRestrictions" TEXT,
    "hasGastricBypass" BOOLEAN NOT NULL DEFAULT false,
    "bypassType" TEXT,
    "otherProcedures" TEXT,
    "sweetPreference" TEXT,
    "sourPreference" TEXT,
    "saltyPreference" TEXT,
    "bitterPreference" TEXT,
    "umamiPreference" TEXT,
    "spicyPreference" TEXT,
    "spiceLevel" TEXT,
    "crispyPreference" TEXT,
    "creamyPreference" TEXT,
    "chewyPreference" TEXT,
    "softPreference" TEXT,
    "crunchyPreference" TEXT,
    "smoothPreference" TEXT,
    "temperaturePreference" TEXT,
    "likedFoods" TEXT NOT NULL DEFAULT '[]',
    "dislikedFoods" TEXT NOT NULL DEFAULT '[]',
    "neutralFoods" TEXT NOT NULL DEFAULT '[]',
    "mealHistory" TEXT NOT NULL DEFAULT '[]',
    "likedMeals" TEXT NOT NULL DEFAULT '[]',
    "dislikedMeals" TEXT NOT NULL DEFAULT '[]',
    "mealRatings" TEXT NOT NULL DEFAULT '{}',
    "mealNotes" TEXT NOT NULL DEFAULT '{}',
    "varietyPreference" TEXT,
    "evaluationFrequency" TEXT,
    "lastCalculated" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "user_profiles_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "meal_distributions" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "profileId" TEXT NOT NULL,
    "breakfastPercent" REAL NOT NULL DEFAULT 25,
    "lunchPercent" REAL NOT NULL DEFAULT 35,
    "dinnerPercent" REAL NOT NULL DEFAULT 30,
    "snackPercent" REAL NOT NULL DEFAULT 10,
    "breakfastMacros" TEXT,
    "lunchMacros" TEXT,
    "dinnerMacros" TEXT,
    "snackMacros" TEXT,
    "breakfastTime" TEXT,
    "lunchTime" TEXT,
    "dinnerTime" TEXT,
    "snackTimes" TEXT NOT NULL DEFAULT '[]',
    "lastMealBeforeBed" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "meal_distributions_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "user_profiles" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "weight_history" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "profileId" TEXT NOT NULL,
    "weight" REAL NOT NULL,
    "date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "weight_history_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "user_profiles" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "meal_consumptions" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "profileId" TEXT NOT NULL,
    "mealId" TEXT NOT NULL,
    "consumedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "mealType" TEXT,
    "rating" INTEGER,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "meal_consumptions_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "user_profiles" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "user_profiles_userId_key" ON "user_profiles"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "meal_distributions_profileId_key" ON "meal_distributions"("profileId");

-- CreateIndex
CREATE INDEX "weight_history_profileId_date_idx" ON "weight_history"("profileId", "date");

-- CreateIndex
CREATE INDEX "meal_consumptions_profileId_consumedAt_idx" ON "meal_consumptions"("profileId", "consumedAt");
