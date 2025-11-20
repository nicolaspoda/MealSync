import { prisma } from "../shared/prisma";
import { MetabolicCalculator } from "./metabolicCalculator";
import type {
  UserCreationParams,
  UserUpdateParams,
  UserProfileCreationParams,
  UserProfileUpdateParams,
  MealDistributionCreationParams,
  CalculatedNeeds,
  WeightHistoryEntry,
  MealConsumptionEntry,
} from "./userProfile";

/**
 * Service for managing users and user profiles
 */
export class UserProfileService {
  /**
   * Create a new user
   */
  public async createUser(params: UserCreationParams) {
    return await prisma.user.create({
      data: {
        email: params.email,
        username: params.username,
      },
    });
  }

  /**
   * Get user by ID
   */
  public async getUser(userId: string) {
    return await prisma.user.findUnique({
      where: { id: userId },
      include: { profile: { include: { mealDistribution: true } } },
    });
  }

  /**
   * Get user by email
   */
  public async getUserByEmail(email: string) {
    return await prisma.user.findUnique({
      where: { email },
      include: { profile: { include: { mealDistribution: true } } },
    });
  }

  /**
   * Update user
   */
  public async updateUser(userId: string, params: UserUpdateParams) {
    return await prisma.user.update({
      where: { id: userId },
      data: {
        email: params.email,
        username: params.username,
      },
    });
  }

  /**
   * Delete user (cascades to profile)
   */
  public async deleteUser(userId: string) {
    return await prisma.user.delete({
      where: { id: userId },
    });
  }

  /**
   * Create or update user profile
   */
  public async createOrUpdateProfile(
    userId: string,
    params: UserProfileCreationParams
  ) {
    // Check if user exists
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new Error("User not found");
    }

    // Prepare profile data
    const profileData: any = {
      userId,
      gender: params.gender,
      birthDate: params.birthDate,
      height: params.height,
      weight: params.weight,
      targetWeight: params.targetWeight,
      bodyFatPercentage: params.bodyFatPercentage,
      leanMass: params.leanMass,
      fatMass: params.fatMass,
      waistCircumference: params.waistCircumference,
      hipCircumference: params.hipCircumference,
      neckCircumference: params.neckCircumference,
      measuredBMR: params.measuredBMR,
      metabolicFactor: params.metabolicFactor,
      healthStatus: params.healthStatus,
      isPregnant: params.isPregnant,
      pregnancyTrimester: params.pregnancyTrimester,
      isLactating: params.isLactating,
      lactationMonths: params.lactationMonths,
      activityLevel: params.activityLevel,
      exerciseType: params.exerciseType,
      exerciseFrequency: params.exerciseFrequency,
      exerciseMinutes: params.exerciseMinutes,
      exerciseIntensity: params.exerciseIntensity,
      trainingGoal: params.trainingGoal,
      workType: params.workType,
      workHoursPerDay: params.workHoursPerDay,
      sleepHours: params.sleepHours,
      sleepQuality: params.sleepQuality,
      stressLevel: params.stressLevel,
      isSmoker: params.isSmoker,
      cigarettesPerDay: params.cigarettesPerDay,
      alcoholConsumption: params.alcoholConsumption,
      alcoholDrinksPerWeek: params.alcoholDrinksPerWeek,
      goal: params.goal,
      targetCalories: params.targetCalories,
      calorieDeficit: params.calorieDeficit,
      calorieSurplus: params.calorieSurplus,
      weightChangeRate: params.weightChangeRate,
      targetBodyFat: params.targetBodyFat,
      targetLeanMass: params.targetLeanMass,
      targetWaist: params.targetWaist,
      performanceGoals: params.performanceGoals,
      mealsPerDay: params.mealsPerDay ?? 3,
      snacksPerDay: params.snacksPerDay ?? 0,
      intermittentFasting: params.intermittentFasting,
      fastingWindowStart: params.fastingWindowStart,
      fastingWindowEnd: params.fastingWindowEnd,
      availableEquipments: JSON.stringify(params.availableEquipments || []),
      kitchenSize: params.kitchenSize,
      cookingSkill: params.cookingSkill,
      masteredTechniques: JSON.stringify(params.masteredTechniques || []),
      hasMobilityIssues: params.hasMobilityIssues,
      physicalLimitations: params.physicalLimitations,
      needsCookingHelp: params.needsCookingHelp,
      maxPrepTimePerMeal: params.maxPrepTimePerMeal,
      maxPrepTimePerDay: params.maxPrepTimePerDay,
      breakfastPrepTime: params.breakfastPrepTime,
      lunchPrepTime: params.lunchPrepTime,
      dinnerPrepTime: params.dinnerPrepTime,
      snackPrepTime: params.snackPrepTime,
      availableDays: JSON.stringify(params.availableDays || []),
      availableHours: params.availableHours ? JSON.stringify(params.availableHours) : null,
      mealPrepPreference: params.mealPrepPreference,
      mealPrepDays: JSON.stringify(params.mealPrepDays || []),
      budgetPerMeal: params.budgetPerMeal,
      budgetPerDay: params.budgetPerDay,
      budgetPerWeek: params.budgetPerWeek,
      budgetPerMonth: params.budgetPerMonth,
      currency: params.currency || "EUR",
      pricePreference: params.pricePreference,
      optimizeForCost: params.optimizeForCost,
      acceptCheaperAlternatives: params.acceptCheaperAlternatives ?? true,
      preferredCookingMethods: JSON.stringify(params.preferredCookingMethods || []),
      avoidedCookingMethods: JSON.stringify(params.avoidedCookingMethods || []),
      complexityPreference: params.complexityPreference,
      maxSteps: params.maxSteps,
      batchCooking: params.batchCooking,
      batchPortions: params.batchPortions,
      storageDays: params.storageDays,
      acceptsFreezing: params.acceptsFreezing ?? true,
      macroRatio: params.macroRatio,
      proteinTarget: params.proteinTarget,
      carbTarget: params.carbTarget,
      fatTarget: params.fatTarget,
      fiberTarget: params.fiberTarget,
      micronutrientFocus: JSON.stringify(params.micronutrientFocus || []),
      prefersWholeFoods: params.prefersWholeFoods,
      prefersOrganic: params.prefersOrganic,
      prefersMinimallyProcessed: params.prefersMinimallyProcessed,
      takesSupplements: params.takesSupplements,
      supplementsList: params.supplementsList,
      allergies: JSON.stringify(params.allergies || []),
      allergySeverity: params.allergySeverity,
      intolerances: JSON.stringify(params.intolerances || []),
      celiac: params.celiac ?? false,
      medicalConditions: JSON.stringify(params.medicalConditions || []),
      medications: params.medications,
      medicationInteractions: params.medicationInteractions,
      sodiumLimit: params.sodiumLimit,
      potassiumLimit: params.potassiumLimit,
      phosphorusLimit: params.phosphorusLimit,
      proteinLimit: params.proteinLimit,
      fluidLimit: params.fluidLimit,
      fiberLimit: params.fiberLimit,
      recentSurgeries: params.recentSurgeries,
      postSurgeryRestrictions: params.postSurgeryRestrictions,
      hasGastricBypass: params.hasGastricBypass,
      bypassType: params.bypassType,
      otherProcedures: params.otherProcedures,
      sweetPreference: params.sweetPreference,
      sourPreference: params.sourPreference,
      saltyPreference: params.saltyPreference,
      bitterPreference: params.bitterPreference,
      umamiPreference: params.umamiPreference,
      spicyPreference: params.spicyPreference,
      spiceLevel: params.spiceLevel,
      crispyPreference: params.crispyPreference,
      creamyPreference: params.creamyPreference,
      chewyPreference: params.chewyPreference,
      softPreference: params.softPreference,
      crunchyPreference: params.crunchyPreference,
      smoothPreference: params.smoothPreference,
      temperaturePreference: params.temperaturePreference,
      likedFoods: JSON.stringify(params.likedFoods || []),
      dislikedFoods: JSON.stringify(params.dislikedFoods || []),
      neutralFoods: JSON.stringify(params.neutralFoods || []),
      varietyPreference: params.varietyPreference,
      evaluationFrequency: params.evaluationFrequency,
    };

    // Calculate metabolic needs
    const calculated = MetabolicCalculator.calculateAllNeeds({
      gender: params.gender,
      birthDate: params.birthDate,
      weight: params.weight,
      height: params.height,
      activityLevel: params.activityLevel,
      goal: params.goal,
      weightChangeRate: params.weightChangeRate,
      leanMass: params.leanMass,
      bodyFatPercentage: params.bodyFatPercentage,
      measuredBMR: params.measuredBMR,
    });

    // Use calculated values or manual override
    profileData.bmr = calculated.bmr;
    profileData.tdee = calculated.tdee;
    profileData.bmi = calculated.bmi;
    profileData.targetCalories = params.targetCalories || calculated.targetCalories;
    profileData.lastCalculated = new Date();

    // Create or update profile
    const profile = await prisma.userProfile.upsert({
      where: { userId },
      create: profileData,
      update: profileData,
      include: { mealDistribution: true },
    });

    // Handle meal distribution
    if (params.mealDistribution) {
      await this.createOrUpdateMealDistribution(profile.id, params.mealDistribution);
    }

    return await this.getProfile(userId);
  }

  /**
   * Get user profile
   */
  public async getProfile(userId: string) {
    const profile = await prisma.userProfile.findUnique({
      where: { userId },
      include: { mealDistribution: true },
    });

    if (!profile) {
      return null;
    }

    return this.parseProfile(profile);
  }

  /**
   * Update user profile (partial update)
   */
  public async updateProfile(
    userId: string,
    params: UserProfileUpdateParams
  ) {
    // Get existing profile
    const existing = await prisma.userProfile.findUnique({
      where: { userId },
    });

    if (!existing) {
      throw new Error("Profile not found");
    }

    // Prepare update data (only include provided fields)
    const updateData: any = {};

    // Copy all provided fields
    Object.keys(params).forEach((key) => {
      const value = (params as any)[key];
      if (value !== undefined) {
        // Handle JSON fields
        if (["availableEquipments", "masteredTechniques", "availableDays", 
             "mealPrepDays", "preferredCookingMethods", "avoidedCookingMethods",
             "micronutrientFocus", "likedFoods", "dislikedFoods", "neutralFoods",
             "medicalConditions",
             "allergies",
             "intolerances"].includes(key)) {
          updateData[key] = JSON.stringify(value);
        } else if (key === "availableHours") {
          updateData[key] = value ? JSON.stringify(value) : null;
        } else {
          updateData[key] = value;
        }
      }
    });

    // Recalculate if relevant fields changed
    const needsRecalculation = [
      "gender", "birthDate", "weight", "height", "activityLevel",
      "goal", "weightChangeRate", "leanMass", "bodyFatPercentage", "measuredBMR"
    ].some(field => field in updateData);

    if (needsRecalculation) {
      const profileData = { ...existing, ...updateData };
      const calculated = MetabolicCalculator.calculateAllNeeds({
        gender: profileData.gender as any,
        birthDate: profileData.birthDate,
        weight: profileData.weight,
        height: profileData.height,
        activityLevel: profileData.activityLevel as any,
        goal: profileData.goal as any,
        weightChangeRate: profileData.weightChangeRate as any,
        leanMass: profileData.leanMass,
        bodyFatPercentage: profileData.bodyFatPercentage,
        measuredBMR: profileData.measuredBMR,
      });

      updateData.bmr = calculated.bmr;
      updateData.tdee = calculated.tdee;
      updateData.bmi = calculated.bmi;
      if (!updateData.targetCalories) {
        updateData.targetCalories = calculated.targetCalories;
      }
      updateData.lastCalculated = new Date();
    }

    await prisma.userProfile.update({
      where: { userId },
      data: updateData,
    });

    return await this.getProfile(userId);
  }

  /**
   * Delete user profile
   */
  public async deleteProfile(userId: string) {
    return await prisma.userProfile.delete({
      where: { userId },
    });
  }

  /**
   * Get calculated needs for a user
   */
  public async getCalculatedNeeds(userId: string): Promise<CalculatedNeeds | null> {
    const profile = await prisma.userProfile.findUnique({
      where: { userId },
      include: { mealDistribution: true },
    });

    if (!profile) {
      return null;
    }

    const targetCalories = profile.targetCalories || 2000; // fallback
    const mealDistribution = profile.mealDistribution;

    const mealCalories = MetabolicCalculator.calculateMealCalories(
      targetCalories,
      mealDistribution ? {
        breakfastPercent: mealDistribution.breakfastPercent,
        lunchPercent: mealDistribution.lunchPercent,
        dinnerPercent: mealDistribution.dinnerPercent,
        snackPercent: mealDistribution.snackPercent,
      } : undefined
    );

    const macros = MetabolicCalculator.calculateMacroTargets(
      targetCalories,
      profile.macroRatio,
      profile.proteinTarget,
      profile.carbTarget,
      profile.fatTarget
    );

    return {
      bmr: profile.bmr || 0,
      tdee: profile.tdee || 0,
      targetCalories: targetCalories,
      bmi: profile.bmi || 0,
      mealCalories: {
        breakfast: mealCalories.breakfast,
        lunch: mealCalories.lunch,
        dinner: mealCalories.dinner,
        snack: mealCalories.snack,
      },
      macros,
    };
  }

  /**
   * Recalculate metabolic needs
   */
  public async recalculateNeeds(userId: string) {
    const profile = await prisma.userProfile.findUnique({
      where: { userId },
    });

    if (!profile) {
      throw new Error("Profile not found");
    }

    const calculated = MetabolicCalculator.calculateAllNeeds({
      gender: profile.gender as any,
      birthDate: profile.birthDate,
      weight: profile.weight,
      height: profile.height,
      activityLevel: profile.activityLevel as any,
      goal: profile.goal as any,
      weightChangeRate: profile.weightChangeRate as any,
      leanMass: profile.leanMass,
      bodyFatPercentage: profile.bodyFatPercentage,
      measuredBMR: profile.measuredBMR,
    });

    await prisma.userProfile.update({
      where: { userId },
      data: {
        bmr: calculated.bmr,
        tdee: calculated.tdee,
        bmi: calculated.bmi,
        targetCalories: calculated.targetCalories,
        lastCalculated: new Date(),
      },
    });

    return await this.getCalculatedNeeds(userId);
  }

  /**
   * Create or update meal distribution
   */
  public async createOrUpdateMealDistribution(
    profileId: string,
    params: MealDistributionCreationParams
  ) {
    return await prisma.mealDistribution.upsert({
      where: { profileId },
      create: {
        profileId,
        breakfastPercent: params.breakfastPercent ?? 25,
        lunchPercent: params.lunchPercent ?? 35,
        dinnerPercent: params.dinnerPercent ?? 30,
        snackPercent: params.snackPercent ?? 10,
        breakfastMacros: params.breakfastMacros ? JSON.stringify(params.breakfastMacros) : null,
        lunchMacros: params.lunchMacros ? JSON.stringify(params.lunchMacros) : null,
        dinnerMacros: params.dinnerMacros ? JSON.stringify(params.dinnerMacros) : null,
        snackMacros: params.snackMacros ? JSON.stringify(params.snackMacros) : null,
        breakfastTime: params.breakfastTime,
        lunchTime: params.lunchTime,
        dinnerTime: params.dinnerTime,
        snackTimes: JSON.stringify(params.snackTimes || []),
        lastMealBeforeBed: params.lastMealBeforeBed,
      },
      update: {
        breakfastPercent: params.breakfastPercent,
        lunchPercent: params.lunchPercent,
        dinnerPercent: params.dinnerPercent,
        snackPercent: params.snackPercent,
        breakfastMacros: params.breakfastMacros ? JSON.stringify(params.breakfastMacros) : null,
        lunchMacros: params.lunchMacros ? JSON.stringify(params.lunchMacros) : null,
        dinnerMacros: params.dinnerMacros ? JSON.stringify(params.dinnerMacros) : null,
        snackMacros: params.snackMacros ? JSON.stringify(params.snackMacros) : null,
        breakfastTime: params.breakfastTime,
        lunchTime: params.lunchTime,
        dinnerTime: params.dinnerTime,
        snackTimes: params.snackTimes ? JSON.stringify(params.snackTimes) : undefined,
        lastMealBeforeBed: params.lastMealBeforeBed,
      },
    });
  }

  /**
   * Add weight history entry
   */
  public async addWeightEntry(
    userId: string,
    weight: number,
    notes?: string
  ): Promise<WeightHistoryEntry> {
    const profile = await prisma.userProfile.findUnique({
      where: { userId },
    });

    if (!profile) {
      throw new Error("Profile not found");
    }

    const entry = await prisma.weightHistory.create({
      data: {
        profileId: profile.id,
        weight,
        notes,
      },
    });

    // Update profile weight
    await prisma.userProfile.update({
      where: { userId },
      data: { weight },
    });

    // Recalculate needs
    await this.recalculateNeeds(userId);

    return {
      id: entry.id,
      weight: entry.weight,
      date: entry.date,
      notes: entry.notes || undefined,
    };
  }

  /**
   * Get weight history
   */
  public async getWeightHistory(userId: string): Promise<WeightHistoryEntry[]> {
    const profile = await prisma.userProfile.findUnique({
      where: { userId },
    });

    if (!profile) {
      return [];
    }

    const entries = await prisma.weightHistory.findMany({
      where: { profileId: profile.id },
      orderBy: { date: "desc" },
    });

    return entries.map((e) => ({
      id: e.id,
      weight: e.weight,
      date: e.date,
      notes: e.notes || undefined,
    }));
  }

  /**
   * Add meal consumption entry
   */
  public async addMealConsumption(
    userId: string,
    mealId: string,
    mealType?: string,
    rating?: number,
    notes?: string
  ): Promise<MealConsumptionEntry> {
    const profile = await prisma.userProfile.findUnique({
      where: { userId },
    });

    if (!profile) {
      throw new Error("Profile not found");
    }

    const entry = await prisma.mealConsumption.create({
      data: {
        profileId: profile.id,
        mealId,
        mealType,
        rating,
        notes,
      },
    });

    // Update profile meal history
    const mealHistory = JSON.parse(profile.mealHistory || "[]");
    mealHistory.push({
      mealId,
      consumedAt: entry.consumedAt,
      mealType,
      rating,
    });
    
    await prisma.userProfile.update({
      where: { userId },
      data: { mealHistory: JSON.stringify(mealHistory) },
    });

    return {
      id: entry.id,
      mealId: entry.mealId,
      consumedAt: entry.consumedAt,
      mealType: entry.mealType as any,
      rating: entry.rating || undefined,
      notes: entry.notes || undefined,
    };
  }

  /**
   * Get meal consumption history
   */
  public async getMealConsumptionHistory(userId: string): Promise<MealConsumptionEntry[]> {
    const profile = await prisma.userProfile.findUnique({
      where: { userId },
    });

    if (!profile) {
      return [];
    }

    const entries = await prisma.mealConsumption.findMany({
      where: { profileId: profile.id },
      orderBy: { consumedAt: "desc" },
      take: 100, // Limit to last 100
    });

    return entries.map((e) => ({
      id: e.id,
      mealId: e.mealId,
      consumedAt: e.consumedAt,
      mealType: e.mealType as any,
      rating: e.rating || undefined,
      notes: e.notes || undefined,
    }));
  }

  /**
   * Parse profile from database (convert JSON strings to objects)
   */
  private parseProfile(profile: any) {
    return {
      ...profile,
      availableEquipments: JSON.parse(profile.availableEquipments || "[]"),
      masteredTechniques: JSON.parse(profile.masteredTechniques || "[]"),
      availableDays: JSON.parse(profile.availableDays || "[]"),
      availableHours: profile.availableHours ? JSON.parse(profile.availableHours) : null,
      mealPrepDays: JSON.parse(profile.mealPrepDays || "[]"),
      preferredCookingMethods: JSON.parse(profile.preferredCookingMethods || "[]"),
      avoidedCookingMethods: JSON.parse(profile.avoidedCookingMethods || "[]"),
      micronutrientFocus: JSON.parse(profile.micronutrientFocus || "[]"),
      likedFoods: JSON.parse(profile.likedFoods || "[]"),
      dislikedFoods: JSON.parse(profile.dislikedFoods || "[]"),
      neutralFoods: JSON.parse(profile.neutralFoods || "[]"),
      allergies: JSON.parse(profile.allergies || "[]"),
      allergySeverity: profile.allergySeverity,
      intolerances: JSON.parse(profile.intolerances || "[]"),
      celiac: profile.celiac,
      medicalConditions: JSON.parse(profile.medicalConditions || "[]"),
      mealHistory: JSON.parse(profile.mealHistory || "[]"),
      likedMeals: JSON.parse(profile.likedMeals || "[]"),
      dislikedMeals: JSON.parse(profile.dislikedMeals || "[]"),
      mealRatings: JSON.parse(profile.mealRatings || "{}"),
      mealNotes: JSON.parse(profile.mealNotes || "{}"),
      mealDistribution: profile.mealDistribution ? {
        ...profile.mealDistribution,
        breakfastMacros: profile.mealDistribution.breakfastMacros 
          ? JSON.parse(profile.mealDistribution.breakfastMacros) 
          : null,
        lunchMacros: profile.mealDistribution.lunchMacros 
          ? JSON.parse(profile.mealDistribution.lunchMacros) 
          : null,
        dinnerMacros: profile.mealDistribution.dinnerMacros 
          ? JSON.parse(profile.mealDistribution.dinnerMacros) 
          : null,
        snackMacros: profile.mealDistribution.snackMacros 
          ? JSON.parse(profile.mealDistribution.snackMacros) 
          : null,
        snackTimes: JSON.parse(profile.mealDistribution.snackTimes || "[]"),
      } : null,
    };
  }
}

