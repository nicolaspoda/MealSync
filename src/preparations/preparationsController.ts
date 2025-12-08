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
} from "tsoa";
import type { Preparation } from "./preparation";
import { PreparationCreationParams, PreparationsService } from "./preparationsService";
import ValidateErrorJSON from "../shared/validationErrorJSON";

@Route("preparations")
@Tags("Preparations")
export class PreparationsController extends Controller {
  /**
   * Retrieves the list of all available preparations in the database.
   * Returns an array containing all preparations (recipe steps) with their information.
   */
  @Get()
  public async getPreparations(): Promise<Preparation[]> {
    return new PreparationsService().getAll();
  }

  /**
   * Retrieves the details of an existing preparation.
   * Supply the unique preparation ID and receive corresponding preparation details.
   * @param preparationId The preparation's identifier
   * @example preparationId "52907745-7672-470e-a803-a2f8feb52944"
   */
  @Get("{preparationId}")
  public async getPreparation(@Path() preparationId: string): Promise<Preparation> {
    const preparation = await new PreparationsService().get(preparationId);
    if (!preparation) {
      this.setStatus(404);
      throw new Error("Preparation not found");
    }
    return preparation;
  }

  /**
   * Creates a new preparation (recipe step) in the database.
   * Allows adding a new preparation step with its description and order.
   * @param requestBody The preparation creation parameters including description, order and associated meal identifier
   */
  @Response<ValidateErrorJSON>(422, "Validation Failed")
  @SuccessResponse("201", "Created")
  @Post()
  @Security("api_key")
  public async createPreparation(
    @Body() requestBody: PreparationCreationParams
  ): Promise<Preparation> {
    this.setStatus(201);
    return await new PreparationsService().create(requestBody);
  }

  /**
   * Updates the information of an existing preparation.
   * Allows modifying the description, order or other properties of a preparation step.
   * @param preparationId The unique identifier of the preparation to update
   * @param requestBody The fields to update (all fields are optional)
   * @example preparationId "52907745-7672-470e-a803-a2f8feb52944"
   */
  @Response<ValidateErrorJSON>(422, "Validation Failed")
  @SuccessResponse("200", "Updated")
  @Put("{preparationId}")
  @Security("api_key")
  public async updatePreparation(
    @Path() preparationId: string,
    @Body() requestBody: Partial<PreparationCreationParams>
  ): Promise<Preparation> {
    const preparation = await new PreparationsService().update(preparationId, requestBody);
    if (!preparation) {
      this.setStatus(404);
      throw new Error("Preparation not found");
    }
    return preparation;
  }

  /**
   * Deletes a preparation from the database.
   * This operation is irreversible. The preparation will be permanently removed from the system.
   * @param preparationId The unique identifier of the preparation to delete
   * @example preparationId "52907745-7672-470e-a803-a2f8feb52944"
   */
  @SuccessResponse("204", "Deleted")
  @Delete("{preparationId}")
  @Security("api_key")
  public async deletePreparation(@Path() preparationId: string): Promise<void> {
    try {
      await new PreparationsService().delete(preparationId);
      this.setStatus(204);
    } catch (error: unknown) {
      const err = error as Error;
      if (err.message.includes("not found") || err.message.includes("Record to delete does not exist")) {
        this.setStatus(404);
        throw new Error("Preparation not found");
      }
      throw error;
    }
  }
}