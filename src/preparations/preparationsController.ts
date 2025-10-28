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
  @Get()
  @Security("api_key")
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

  @Response<ValidateErrorJSON>(422, "Validation Failed")
  @SuccessResponse("201", "Created")
  @Post()
  public async createPreparation(
    @Body() requestBody: PreparationCreationParams
  ): Promise<Preparation> {
    this.setStatus(201);
    return await new PreparationsService().create(requestBody);
  }

  @Response<ValidateErrorJSON>(422, "Validation Failed")
  @SuccessResponse("200", "Updated")
  @Put("{preparationId}")
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

  @SuccessResponse("204", "Deleted")
  @Delete("{preparationId}")
  public async deletePreparation(@Path() preparationId: string): Promise<void> {
    const success = await new PreparationsService().delete(preparationId);
    if (!success) {
      this.setStatus(404);
      throw new Error("Preparation not found");
    }
    this.setStatus(204);
  }
}