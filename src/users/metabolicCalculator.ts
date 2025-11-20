import type { 
  Gender, 
  ActivityLevel, 
  Goal, 
  WeightChangeRate,
  UserProfileCreationParams 
} from "./userProfile";

/**
 * Activity level multipliers for TDEE calculation
 */
const ACTIVITY_MULTIPLIERS: Record<ActivityLevel, number> = {
  SEDENTARY: 1.2,
  LIGHTLY_ACTIVE: 1.375,
  MODERATELY_ACTIVE: 1.55,
  VERY_ACTIVE: 1.725,
  EXTRA_ACTIVE: 1.9,
};

/**
 * Calorie adjustments based on goal
 */
const GOAL_ADJUSTMENTS: Record<Goal, { deficit?: number; surplus?: number }> = {
  LOSE_WEIGHT: { deficit: 500 },
  MAINTAIN_WEIGHT: {},
  GAIN_WEIGHT: { surplus: 300 },
  BUILD_MUSCLE: { surplus: 300 },
  RECOMPOSITION: { deficit: 250 },
  IMPROVE_HEALTH: {},
  PERFORMANCE: { surplus: 200 },
  PREGNANCY: { surplus: 300 },  // First trimester, increases later
  LACTATION: { surplus: 500 },
};

/**
 * Weight change rate adjustments
 */
const WEIGHT_CHANGE_RATE_ADJUSTMENTS: Record<WeightChangeRate, number> = {
  CONSERVATIVE: 250,  // 0.25-0.5 kg/week
  MODERATE: 500,      // 0.5-1 kg/week
  AGGRESSIVE: 750,    // 1-1.5 kg/week
};

/**
 * Service for calculating metabolic needs (BMR, TDEE, target calories)
 */
export class MetabolicCalculator {
  /**
   * Calculate BMR using Mifflin-St Jeor formula (most accurate)
   * 
   * @param gender - Gender of the person
   * @param weight - Weight in kg
   * @param height - Height in cm
   * @param age - Age in years
   * @returns BMR in kcal/day
   */
  public static calculateBMR(
    gender: Gender | null | undefined,
    weight: number | null | undefined,
    height: number | null | undefined,
    age: number | null | undefined
  ): number | null {
    if (!gender || !weight || !height || !age) {
      return null;
    }

    // Mifflin-St Jeor formula
    const baseBMR = 10 * weight + 6.25 * height - 5 * age;
    
    if (gender === "MALE") {
      return baseBMR + 5;
    } else if (gender === "FEMALE") {
      return baseBMR - 161;
    } else {
      // For OTHER or PREFER_NOT_TO_SAY, use average
      return baseBMR - 78;  // Average of male and female
    }
  }

  /**
   * Calculate BMR using Katch-McArdle formula (requires body fat %)
   * More accurate if body fat percentage is known
   * 
   * @param leanMass - Lean body mass in kg
   * @returns BMR in kcal/day
   */
  public static calculateBMRKatchMcArdle(leanMass: number | null | undefined): number | null {
    if (!leanMass || leanMass <= 0) {
      return null;
    }
    
    return 370 + (21.6 * leanMass);
  }

  /**
   * Calculate TDEE (Total Daily Energy Expenditure)
   * 
   * @param bmr - Basal Metabolic Rate in kcal/day
   * @param activityLevel - Activity level
   * @returns TDEE in kcal/day
   */
  public static calculateTDEE(
    bmr: number | null | undefined,
    activityLevel: ActivityLevel | null | undefined
  ): number | null {
    if (!bmr || !activityLevel) {
      return null;
    }

    const multiplier = ACTIVITY_MULTIPLIERS[activityLevel];
    return bmr * multiplier;
  }

  /**
   * Calculate target calories based on goal
   * 
   * @param tdee - Total Daily Energy Expenditure in kcal/day
   * @param goal - Goal of the user
   * @param weightChangeRate - Rate of weight change desired
   * @returns Target calories in kcal/day
   */
  public static calculateTargetCalories(
    tdee: number | null | undefined,
    goal: Goal | null | undefined,
    weightChangeRate: WeightChangeRate | null | undefined
  ): number | null {
    if (!tdee || !goal) {
      return null;
    }

    const adjustment = GOAL_ADJUSTMENTS[goal];
    let targetCalories = tdee;

    // Apply goal-based adjustment
    if (adjustment.deficit) {
      targetCalories -= adjustment.deficit;
    } else if (adjustment.surplus) {
      targetCalories += adjustment.surplus;
    }

    // Apply weight change rate adjustment if specified
    if (weightChangeRate && (goal === "LOSE_WEIGHT" || goal === "GAIN_WEIGHT")) {
      const rateAdjustment = WEIGHT_CHANGE_RATE_ADJUSTMENTS[weightChangeRate];
      if (goal === "LOSE_WEIGHT") {
        targetCalories -= (rateAdjustment - 500);  // Adjust from base 500
      } else {
        targetCalories += (rateAdjustment - 300);  // Adjust from base 300
      }
    }

    // Ensure minimum calories (safety)
    const minCalories = 1200;
    return Math.max(targetCalories, minCalories);
  }

  /**
   * Calculate BMI (Body Mass Index)
   * 
   * @param weight - Weight in kg
   * @param height - Height in cm
   * @returns BMI
   */
  public static calculateBMI(
    weight: number | null | undefined,
    height: number | null | undefined
  ): number | null {
    if (!weight || !height || height <= 0) {
      return null;
    }

    const heightInMeters = height / 100;
    return weight / (heightInMeters * heightInMeters);
  }

  /**
   * Calculate age from birth date
   * 
   * @param birthDate - Date of birth
   * @returns Age in years
   */
  public static calculateAge(birthDate: Date | null | undefined): number | null {
    if (!birthDate) {
      return null;
    }

    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  }

  /**
   * Calculate all metabolic needs from profile data
   * 
   * @param profile - User profile data
   * @returns Calculated needs (BMR, TDEE, target calories, BMI)
   */
  public static calculateAllNeeds(profile: {
    gender?: Gender | null;
    birthDate?: Date | null;
    weight?: number | null;
    height?: number | null;
    activityLevel?: ActivityLevel | null;
    goal?: Goal | null;
    weightChangeRate?: WeightChangeRate | null;
    leanMass?: number | null;
    bodyFatPercentage?: number | null;
    measuredBMR?: number | null;
    metabolicFactor?: number | null;
  }): {
    bmr: number | null;
    tdee: number | null;
    targetCalories: number | null;
    bmi: number | null;
    age: number | null;
  } {
    const age = this.calculateAge(profile.birthDate);
    
    // Use measured BMR if available, otherwise calculate
    let bmr: number | null = profile.measuredBMR || null;
    
    if (!bmr) {
      // Try Katch-McArdle if lean mass is available
      if (profile.leanMass) {
        bmr = this.calculateBMRKatchMcArdle(profile.leanMass);
      }
      
      // Fall back to Mifflin-St Jeor
      if (!bmr && profile.gender && profile.weight && profile.height && age) {
        bmr = this.calculateBMR(profile.gender, profile.weight, profile.height, age);
      }
    }
    
    // Apply metabolic factor if provided
    if (bmr && profile.metabolicFactor) {
      bmr = bmr * profile.metabolicFactor;
    }
    
    const tdee = this.calculateTDEE(bmr, profile.activityLevel || null);
    const targetCalories = this.calculateTargetCalories(
      tdee,
      profile.goal || null,
      profile.weightChangeRate || null
    );
    const bmi = this.calculateBMI(profile.weight, profile.height);
    
    return {
      bmr,
      tdee,
      targetCalories,
      bmi,
      age,
    };
  }

  /**
   * Calculate calories per meal type based on distribution
   * 
   * @param targetCalories - Total target calories per day
   * @param mealDistribution - Meal distribution percentages
   * @returns Calories per meal type
   */
  public static calculateMealCalories(
    targetCalories: number,
    mealDistribution?: {
      breakfastPercent?: number;
      lunchPercent?: number;
      dinnerPercent?: number;
      snackPercent?: number;
    }
  ): {
    breakfast: number;
    lunch: number;
    dinner: number;
    snack: number;
  } {
    const breakfastPercent = mealDistribution?.breakfastPercent ?? 25;
    const lunchPercent = mealDistribution?.lunchPercent ?? 35;
    const dinnerPercent = mealDistribution?.dinnerPercent ?? 30;
    const snackPercent = mealDistribution?.snackPercent ?? 10;
    
    return {
      breakfast: Math.round(targetCalories * (breakfastPercent / 100)),
      lunch: Math.round(targetCalories * (lunchPercent / 100)),
      dinner: Math.round(targetCalories * (dinnerPercent / 100)),
      snack: Math.round(targetCalories * (snackPercent / 100)),
    };
  }

  /**
   * Calculate macro targets based on ratio and total calories
   * 
   * @param targetCalories - Total target calories per day
   * @param macroRatio - Macro ratio preference
   * @param proteinTarget - Specific protein target (g or %)
   * @param carbTarget - Specific carb target (g or %)
   * @param fatTarget - Specific fat target (g or %)
   * @returns Macro targets in grams
   */
  public static calculateMacroTargets(
    targetCalories: number,
    macroRatio?: string | null,
    proteinTarget?: number | null,
    carbTarget?: number | null,
    fatTarget?: number | null
  ): {
    protein: number;
    carbs: number;
    fat: number;
  } {
    // If specific targets are provided, use them
    if (proteinTarget && carbTarget && fatTarget) {
      // Check if they're percentages or grams
      if (proteinTarget <= 100 && carbTarget <= 100 && fatTarget <= 100) {
        // Percentages
        return {
          protein: Math.round((targetCalories * (proteinTarget / 100)) / 4),
          carbs: Math.round((targetCalories * (carbTarget / 100)) / 4),
          fat: Math.round((targetCalories * (fatTarget / 100)) / 9),
        };
      } else {
        // Already in grams
        return {
          protein: Math.round(proteinTarget),
          carbs: Math.round(carbTarget),
          fat: Math.round(fatTarget),
        };
      }
    }
    
    // Default ratios based on macroRatio
    let proteinPercent = 30;
    let carbPercent = 40;
    let fatPercent = 30;
    
    switch (macroRatio) {
      case "HIGH_PROTEIN":
        proteinPercent = 35;
        carbPercent = 35;
        fatPercent = 30;
        break;
      case "BALANCED":
        proteinPercent = 30;
        carbPercent = 40;
        fatPercent = 30;
        break;
      case "LOW_CARB":
        proteinPercent = 30;
        carbPercent = 10;
        fatPercent = 60;
        break;
      case "MODERATE_CARB":
        proteinPercent = 30;
        carbPercent = 30;
        fatPercent = 40;
        break;
      case "HIGH_CARB":
        proteinPercent = 25;
        carbPercent = 55;
        fatPercent = 20;
        break;
      case "LOW_FAT":
        proteinPercent = 40;
        carbPercent = 50;
        fatPercent = 10;
        break;
      case "MODERATE_FAT":
        proteinPercent = 30;
        carbPercent = 40;
        fatPercent = 30;
        break;
      case "HIGH_FAT":
        proteinPercent = 25;
        carbPercent = 30;
        fatPercent = 45;
        break;
      case "KETO_RATIO":
        proteinPercent = 20;
        carbPercent = 10;
        fatPercent = 70;
        break;
    }
    
    return {
      protein: Math.round((targetCalories * (proteinPercent / 100)) / 4),
      carbs: Math.round((targetCalories * (carbPercent / 100)) / 4),
      fat: Math.round((targetCalories * (fatPercent / 100)) / 9),
    };
  }
}

