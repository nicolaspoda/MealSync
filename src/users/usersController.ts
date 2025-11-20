import {
  Body,
  Controller,
  Get,
  Path,
  Post,
  Put,
  Delete,
  Route,
  SuccessResponse,
  Response,
  Security,
  Tags,
  Query,
} from "tsoa";
import { UserProfileService } from "./userProfileService";
import type {
  UserCreationParams,
  UserUpdateParams,
  UserProfileCreationParams,
  UserProfileUpdateParams,
  CalculatedNeeds,
  WeightHistoryEntry,
  MealConsumptionEntry,
} from "./userProfile";
import ValidateErrorJSON from "../shared/validationErrorJSON";

@Route("users")
@Tags("Users")
export class UsersController extends Controller {
  /**
   * Create a new user
   * @param requestBody User creation parameters
   */
  @Response<ValidateErrorJSON>(422, "Validation Failed")
  @SuccessResponse("201", "Created")
  @Post()
  @Security("api_key")
  public async createUser(
    @Body() requestBody: UserCreationParams
  ): Promise<any> {
    this.setStatus(201);
    return await new UserProfileService().createUser(requestBody);
  }

  /**
   * Get user by ID
   * @param userId The user's identifier
   */
  @Get("{userId}")
  @Security("api_key")
  public async getUser(@Path() userId: string): Promise<any> {
    const user = await new UserProfileService().getUser(userId);
    if (!user) {
      this.setStatus(404);
      throw new Error("User not found");
    }
    return user;
  }

  /**
   * Update user
   * @param userId The user's identifier
   * @param requestBody User update parameters
   */
  @Response<ValidateErrorJSON>(422, "Validation Failed")
  @SuccessResponse("200", "Updated")
  @Put("{userId}")
  @Security("api_key")
  public async updateUser(
    @Path() userId: string,
    @Body() requestBody: UserUpdateParams
  ): Promise<any> {
    const user = await new UserProfileService().updateUser(userId, requestBody);
    if (!user) {
      this.setStatus(404);
      throw new Error("User not found");
    }
    return user;
  }

  /**
   * Delete user
   * @param userId The user's identifier
   */
  @SuccessResponse("204", "Deleted")
  @Delete("{userId}")
  @Security("api_key")
  public async deleteUser(@Path() userId: string): Promise<void> {
    const success = await new UserProfileService().deleteUser(userId);
    if (!success) {
      this.setStatus(404);
      throw new Error("User not found");
    }
    this.setStatus(204);
  }

  /**
   * Get user profile
   * Retrieves the complete user profile with all preferences and settings
   * @param userId The user's identifier
   */
  @Get("{userId}/profile")
  @Security("api_key")
  public async getProfile(@Path() userId: string): Promise<any> {
    const profile = await new UserProfileService().getProfile(userId);
    if (!profile) {
      this.setStatus(404);
      throw new Error("Profile not found");
    }
    return profile;
  }

  /**
   * Create or update user profile
   * Creates a new profile or updates an existing one with comprehensive user preferences
   * @param userId The user's identifier
   * @param requestBody Complete profile creation parameters
   */
  @Response<ValidateErrorJSON>(422, "Validation Failed")
  @SuccessResponse("201", "Profile Created")
  @Post("{userId}/profile")
  @Security("api_key")
  public async createOrUpdateProfile(
    @Path() userId: string,
    @Body() requestBody: UserProfileCreationParams
  ): Promise<any> {
    this.setStatus(201);
    return await new UserProfileService().createOrUpdateProfile(userId, requestBody);
  }

  /**
   * Update user profile (partial update)
   * Updates specific fields of the user profile
   * @param userId The user's identifier
   * @param requestBody Profile update parameters (all fields optional)
   */
  @Response<ValidateErrorJSON>(422, "Validation Failed")
  @SuccessResponse("200", "Profile Updated")
  @Put("{userId}/profile")
  @Security("api_key")
  public async updateProfile(
    @Path() userId: string,
    @Body() requestBody: UserProfileUpdateParams
  ): Promise<any> {
    const profile = await new UserProfileService().updateProfile(userId, requestBody);
    if (!profile) {
      this.setStatus(404);
      throw new Error("Profile not found");
    }
    return profile;
  }

  /**
   * Delete user profile
   * @param userId The user's identifier
   */
  @SuccessResponse("204", "Profile Deleted")
  @Delete("{userId}/profile")
  @Security("api_key")
  public async deleteProfile(@Path() userId: string): Promise<void> {
    const success = await new UserProfileService().deleteProfile(userId);
    if (!success) {
      this.setStatus(404);
      throw new Error("Profile not found");
    }
    this.setStatus(204);
  }

  /**
   * Get calculated metabolic needs
   * Returns BMR, TDEE, target calories, BMI, and meal-specific calorie targets
   * @param userId The user's identifier
   */
  @Get("{userId}/profile/calculated-needs")
  @Security("api_key")
  public async getCalculatedNeeds(
    @Path() userId: string
  ): Promise<CalculatedNeeds> {
    const needs = await new UserProfileService().getCalculatedNeeds(userId);
    if (!needs) {
      this.setStatus(404);
      throw new Error("Profile not found");
    }
    return needs;
  }

  /**
   * Recalculate metabolic needs
   * Forces recalculation of BMR, TDEE, and target calories based on current profile data
   * @param userId The user's identifier
   */
  @Post("{userId}/profile/recalculate")
  @Security("api_key")
  public async recalculateNeeds(
    @Path() userId: string
  ): Promise<CalculatedNeeds> {
    const needs = await new UserProfileService().recalculateNeeds(userId);
    if (!needs) {
      this.setStatus(404);
      throw new Error("Profile not found");
    }
    return needs;
  }

  /**
   * Add weight history entry
   * Records a weight measurement and automatically recalculates metabolic needs
   * @param userId The user's identifier
   * @param requestBody Weight entry data
   */
  @Response<ValidateErrorJSON>(422, "Validation Failed")
  @SuccessResponse("201", "Weight Entry Added")
  @Post("{userId}/history/weight")
  @Security("api_key")
  public async addWeightEntry(
    @Path() userId: string,
    @Body() requestBody: { weight: number; notes?: string }
  ): Promise<WeightHistoryEntry> {
    this.setStatus(201);
    return await new UserProfileService().addWeightEntry(
      userId,
      requestBody.weight,
      requestBody.notes
    );
  }

  /**
   * Get weight history
   * Retrieves all weight measurements for the user
   * @param userId The user's identifier
   */
  @Get("{userId}/history/weight")
  @Security("api_key")
  public async getWeightHistory(
    @Path() userId: string
  ): Promise<WeightHistoryEntry[]> {
    return await new UserProfileService().getWeightHistory(userId);
  }

  /**
   * Add meal consumption entry
   * Records that a meal was consumed, with optional rating and notes
   * @param userId The user's identifier
   * @param requestBody Meal consumption data
   */
  @Response<ValidateErrorJSON>(422, "Validation Failed")
  @SuccessResponse("201", "Meal Consumption Recorded")
  @Post("{userId}/history/meals")
  @Security("api_key")
  public async addMealConsumption(
    @Path() userId: string,
    @Body() requestBody: {
      mealId: string;
      mealType?: string;
      rating?: number;
      notes?: string;
    }
  ): Promise<MealConsumptionEntry> {
    this.setStatus(201);
    return await new UserProfileService().addMealConsumption(
      userId,
      requestBody.mealId,
      requestBody.mealType,
      requestBody.rating,
      requestBody.notes
    );
  }

  /**
   * Get meal consumption history
   * Retrieves the meal consumption history for the user
   * @param userId The user's identifier
   */
  @Get("{userId}/history/meals")
  @Security("api_key")
  public async getMealConsumptionHistory(
    @Path() userId: string
  ): Promise<MealConsumptionEntry[]> {
    return await new UserProfileService().getMealConsumptionHistory(userId);
  }
}





