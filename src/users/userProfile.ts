import { UUID } from "../shared/uuid";

/**
 * Gender options
 */
export type Gender = "MALE" | "FEMALE" | "OTHER" | "PREFER_NOT_TO_SAY";

/**
 * Activity level options
 */
export type ActivityLevel = 
  | "SEDENTARY"        // 1.2
  | "LIGHTLY_ACTIVE"   // 1.375
  | "MODERATELY_ACTIVE" // 1.55
  | "VERY_ACTIVE"      // 1.725
  | "EXTRA_ACTIVE";    // 1.9

/**
 * Exercise type options
 */
export type ExerciseType = 
  | "CARDIO"
  | "STRENGTH"
  | "FLEXIBILITY"
  | "SPORTS"
  | "MIXED"
  | "NONE";

/**
 * Exercise intensity options
 */
export type ExerciseIntensity = "LOW" | "MODERATE" | "HIGH" | "VERY_HIGH";

/**
 * Training goal options
 */
export type TrainingGoal = 
  | "ENDURANCE"
  | "STRENGTH_GAIN"
  | "MUSCLE_GAIN"
  | "FAT_LOSS"
  | "FLEXIBILITY"
  | "GENERAL_FITNESS";

/**
 * Work type options
 */
export type WorkType = "SEDENTARY" | "LIGHT" | "MODERATE" | "ACTIVE" | "VERY_ACTIVE";

/**
 * Health status options
 */
export type HealthStatus = "EXCELLENT" | "GOOD" | "FAIR" | "POOR";

/**
 * Sleep quality options
 */
export type SleepQuality = "EXCELLENT" | "GOOD" | "FAIR" | "POOR";

/**
 * Stress level options
 */
export type StressLevel = "LOW" | "MODERATE" | "HIGH" | "VERY_HIGH";

/**
 * Alcohol consumption options
 */
export type AlcoholConsumption = "NONE" | "OCCASIONAL" | "MODERATE" | "HEAVY";

/**
 * Goal options
 */
export type Goal = 
  | "LOSE_WEIGHT"
  | "MAINTAIN_WEIGHT"
  | "GAIN_WEIGHT"
  | "BUILD_MUSCLE"
  | "RECOMPOSITION"
  | "IMPROVE_HEALTH"
  | "PERFORMANCE"
  | "PREGNANCY"
  | "LACTATION";

/**
 * Weight change rate options
 */
export type WeightChangeRate = "CONSERVATIVE" | "MODERATE" | "AGGRESSIVE";

/**
 * Intermittent fasting types
 */
export type IntermittentFasting = 
  | "NONE"
  | "16_8"
  | "18_6"
  | "20_4"
  | "OMAD"
  | "5_2"
  | "ALTERNATE_DAY";

/**
 * Kitchen size options
 */
export type KitchenSize = "SMALL" | "MEDIUM" | "LARGE";

/**
 * Cooking skill level options
 */
export type CookingSkill = "BEGINNER" | "INTERMEDIATE" | "ADVANCED" | "PROFESSIONAL";

/**
 * Complexity preference options
 */
export type Complexity = "SIMPLE" | "MODERATE" | "COMPLEX";

/**
 * Price preference options
 */
export type PricePreference = "BUDGET" | "MODERATE" | "PREMIUM" | "LUXURY";

/**
 * Macro ratio options
 */
export type MacroRatio = 
  | "HIGH_PROTEIN"
  | "BALANCED"
  | "LOW_CARB"
  | "MODERATE_CARB"
  | "HIGH_CARB"
  | "LOW_FAT"
  | "MODERATE_FAT"
  | "HIGH_FAT"
  | "KETO_RATIO";

/**
 * Taste preference options
 */
export type TastePreference = "LIKE" | "NEUTRAL" | "DISLIKE";

/**
 * Spice level options
 */
export type SpiceLevel = "NONE" | "MILD" | "MODERATE" | "HOT" | "VERY_HOT" | "EXTREME";

/**
 * Texture preference options
 */
export type TexturePreference = "LIKE" | "NEUTRAL" | "DISLIKE";

/**
 * Temperature preference options
 */
export type TemperaturePreference = "HOT" | "WARM" | "ROOM_TEMPERATURE" | "COLD" | "FROZEN";

/**
 * Variety preference options
 */
export type VarietyPreference = "HIGH" | "MODERATE" | "LOW";

/**
 * Evaluation frequency options
 */
export type EvaluationFrequency = "WEEKLY" | "MONTHLY" | "QUARTERLY";

/**
 * Meal type options
 */
export type MealType = "BREAKFAST" | "LUNCH" | "DINNER" | "SNACK";

/**
 * Dietary restriction options
 */
export type DietaryRestriction = 
  | "OMNIVORE"
  | "VEGETARIAN"
  | "VEGAN"
  | "PESCATARIAN"
  | "POLLOTARIAN"
  | "FLEXITARIAN"
  | "PALEO"
  | "KETO"
  | "LOW_CARB"
  | "LOW_FAT"
  | "MEDITERRANEAN"
  | "DASH"
  | "MIND"
  | "WHOLE30"
  | "RAW_FOOD"
  | "MACROBIOTIC"
  | "AYURVEDIC"
  | "CUSTOM";

/**
 * Allergy options (major allergens)
 */
export type Allergy = 
  | "PEANUTS"
  | "TREE_NUTS"
  | "MILK"
  | "EGGS"
  | "FISH"
  | "SHELLFISH"
  | "SOY"
  | "WHEAT"
  | "SESAME"
  | "MUSTARD"
  | "CELERY"
  | "LUPIN"
  | "MOLLUSCS"
  | "SULPHITES";

/**
 * Intolerance options
 */
export type Intolerance = 
  | "LACTOSE"
  | "GLUTEN"
  | "FRUCTOSE"
  | "HISTAMINE"
  | "FODMAP"
  | "SULPHITES";

/**
 * Severity options
 */
export type Severity = "MILD" | "MODERATE" | "SEVERE" | "LIFE_THREATENING";

/**
 * Medical condition options
 */
export type MedicalCondition = 
  | "DIABETES_TYPE_1"
  | "DIABETES_TYPE_2"
  | "PREDIABETES"
  | "HYPERTENSION"
  | "HYPOTENSION"
  | "HEART_DISEASE"
  | "KIDNEY_DISEASE"
  | "LIVER_DISEASE"
  | "PCOS"
  | "THYROID_ISSUES"
  | "IBS"
  | "IBD"
  | "CROHNS"
  | "ULCERATIVE_COLITIS"
  | "GERD"
  | "GALLSTONES"
  | "OSTEOPOROSIS"
  | "ARTHRITIS"
  | "GOUT"
  | "MIGRAINES"
  | "EPILEPSY";

/**
 * Cooking method options
 */
export type CookingMethod = 
  | "BAKING"
  | "GRILLING"
  | "STEAMING"
  | "BOILING"
  | "SAUTEING"
  | "ROASTING"
  | "RAW"
  | "SLOW_COOKING"
  | "PRESSURE_COOKING"
  | "SOUS_VIDE";

/**
 * Micronutrient focus options
 */
export type Micronutrient = 
  | "IRON"
  | "CALCIUM"
  | "VITAMIN_D"
  | "VITAMIN_B12"
  | "OMEGA_3"
  | "MAGNESIUM"
  | "ZINC"
  | "FOLATE";

/**
 * User creation parameters
 */
export interface UserCreationParams {
  email: string;
  username?: string;
}

/**
 * User update parameters
 */
export interface UserUpdateParams {
  email?: string;
  username?: string;
}

/**
 * Meal distribution macros (percentages)
 */
export interface MealMacros {
  protein: number;  // %
  carbs: number;    // %
  fat: number;      // %
}

/**
 * Meal distribution creation parameters
 */
export interface MealDistributionCreationParams {
  breakfastPercent?: number;
  lunchPercent?: number;
  dinnerPercent?: number;
  snackPercent?: number;
  breakfastMacros?: MealMacros;
  lunchMacros?: MealMacros;
  dinnerMacros?: MealMacros;
  snackMacros?: MealMacros;
  breakfastTime?: string;
  lunchTime?: string;
  dinnerTime?: string;
  snackTimes?: string[];
  lastMealBeforeBed?: number;
}

/**
 * User profile creation parameters
 * This is a comprehensive interface covering all possible criteria
 */
export interface UserProfileCreationParams {
  // Données physiques de base
  gender?: Gender;
  birthDate?: Date;
  height?: number;  // cm
  weight?: number;  // kg
  targetWeight?: number;  // kg
  
  // Composition corporelle
  bodyFatPercentage?: number;  // %
  leanMass?: number;  // kg
  fatMass?: number;  // kg
  waistCircumference?: number;  // cm
  hipCircumference?: number;  // cm
  neckCircumference?: number;  // cm
  
  // Métabolisme
  measuredBMR?: number;  // kcal/jour
  metabolicFactor?: number;
  
  // Santé générale
  healthStatus?: HealthStatus;
  isPregnant?: boolean;
  pregnancyTrimester?: number;  // 1, 2, 3
  isLactating?: boolean;
  lactationMonths?: number;
  
  // Activité et mode de vie
  activityLevel?: ActivityLevel;
  exerciseType?: ExerciseType;
  exerciseFrequency?: number;  // jours/semaine (0-7)
  exerciseMinutes?: number;  // minutes par session
  exerciseIntensity?: ExerciseIntensity;
  trainingGoal?: TrainingGoal;
  workType?: WorkType;
  workHoursPerDay?: number;
  sleepHours?: number;
  sleepQuality?: SleepQuality;
  stressLevel?: StressLevel;
  isSmoker?: boolean;
  cigarettesPerDay?: number;
  alcoholConsumption?: AlcoholConsumption;
  alcoholDrinksPerWeek?: number;
  
  // Objectifs
  goal?: Goal;
  targetCalories?: number;  // kcal/jour (manuel)
  calorieDeficit?: number;  // kcal/jour
  calorieSurplus?: number;  // kcal/jour
  weightChangeRate?: WeightChangeRate;
  targetBodyFat?: number;  // %
  targetLeanMass?: number;  // kg
  targetWaist?: number;  // cm
  performanceGoals?: string;
  
  // Répartition des repas
  mealsPerDay?: number;  // 1-8
  snacksPerDay?: number;  // 0-5
  intermittentFasting?: IntermittentFasting;
  fastingWindowStart?: string;  // "HH:MM"
  fastingWindowEnd?: string;  // "HH:MM"
  
  // Contraintes pratiques
  availableEquipments?: string[];  // IDs
  kitchenSize?: KitchenSize;
  cookingSkill?: CookingSkill;
  masteredTechniques?: CookingMethod[];
  hasMobilityIssues?: boolean;
  physicalLimitations?: string;
  needsCookingHelp?: boolean;
  
  // Contraintes temporelles
  maxPrepTimePerMeal?: number;  // minutes
  maxPrepTimePerDay?: number;  // minutes
  breakfastPrepTime?: number;
  lunchPrepTime?: number;
  dinnerPrepTime?: number;
  snackPrepTime?: number;
  availableDays?: string[];  // ["LUN", "MAR", ...]
  availableHours?: { start: string; end: string };
  mealPrepPreference?: boolean;
  mealPrepDays?: string[];
  
  // Contraintes budgétaires
  budgetPerMeal?: number;
  budgetPerDay?: number;
  budgetPerWeek?: number;
  budgetPerMonth?: number;
  currency?: string;
  pricePreference?: PricePreference;
  optimizeForCost?: boolean;
  acceptCheaperAlternatives?: boolean;
  
  // Préférences de préparation
  preferredCookingMethods?: CookingMethod[];
  avoidedCookingMethods?: CookingMethod[];
  complexityPreference?: Complexity;
  maxSteps?: number;
  batchCooking?: boolean;
  batchPortions?: number;
  storageDays?: number;
  acceptsFreezing?: boolean;
  
  // Préférences nutritionnelles
  macroRatio?: MacroRatio;
  proteinTarget?: number;  // g/jour ou %
  carbTarget?: number;  // g/jour ou %
  fatTarget?: number;  // g/jour ou %
  fiberTarget?: number;  // g/jour
  micronutrientFocus?: Micronutrient[];
  prefersWholeFoods?: boolean;
  prefersOrganic?: boolean;
  prefersMinimallyProcessed?: boolean;
  takesSupplements?: boolean;
  supplementsList?: string;
  
  // Contraintes médicales
  medicalConditions?: MedicalCondition[];
  medications?: string;
  medicationInteractions?: string;
  sodiumLimit?: number;  // mg/jour
  potassiumLimit?: number;  // mg/jour
  phosphorusLimit?: number;  // mg/jour
  proteinLimit?: number;  // g/jour
  fluidLimit?: number;  // ml/jour
  fiberLimit?: number;  // g/jour
  recentSurgeries?: string;
  postSurgeryRestrictions?: string;
  hasGastricBypass?: boolean;
  bypassType?: string;
  otherProcedures?: string;
  
  // Préférences de goût
  sweetPreference?: TastePreference;
  sourPreference?: TastePreference;
  saltyPreference?: TastePreference;
  bitterPreference?: TastePreference;
  umamiPreference?: TastePreference;
  spicyPreference?: TastePreference;
  spiceLevel?: SpiceLevel;
  crispyPreference?: TexturePreference;
  creamyPreference?: TexturePreference;
  chewyPreference?: TexturePreference;
  softPreference?: TexturePreference;
  crunchyPreference?: TexturePreference;
  smoothPreference?: TexturePreference;
  temperaturePreference?: TemperaturePreference;
  likedFoods?: string[];
  dislikedFoods?: string[];
  neutralFoods?: string[];
  
  // Historique et suivi
  varietyPreference?: VarietyPreference;
  evaluationFrequency?: EvaluationFrequency;
  
  // Préférences alimentaires (à ajouter dans une table séparée ou JSON)
  dietaryRestrictions?: DietaryRestriction[];
  excludedAliments?: string[];
  preferredCuisines?: string[];
  allergies?: Allergy[];
  allergySeverity?: Severity;
  intolerances?: Intolerance[];
  celiac?: boolean;
  
  // Meal distribution
  mealDistribution?: MealDistributionCreationParams;
}

/**
 * User profile update parameters (all fields optional)
 */
export interface UserProfileUpdateParams extends Partial<UserProfileCreationParams> {}

/**
 * Calculated needs response
 */
export interface CalculatedNeeds {
  bmr: number;  // kcal/jour
  tdee: number;  // kcal/jour
  targetCalories: number;  // kcal/jour
  bmi: number;
  mealCalories: {
    breakfast?: number;
    lunch?: number;
    dinner?: number;
    snack?: number;
  };
  macros: {
    protein: number;  // g
    carbs: number;  // g
    fat: number;  // g
  };
}

/**
 * Weight history entry
 */
export interface WeightHistoryEntry {
  id: string;
  weight: number;  // kg
  date: Date;
  notes?: string;
}

/**
 * Meal consumption entry
 */
export interface MealConsumptionEntry {
  id: string;
  mealId: string;
  consumedAt: Date;
  mealType?: MealType;
  rating?: number;  // 1-5
  notes?: string;
}





