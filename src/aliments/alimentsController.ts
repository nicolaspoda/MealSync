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
import type { Aliment } from "./aliment";
import { AlimentCreationParams, AlimentsService } from "./alimentsService";
import ValidateErrorJSON from "../shared/validationErrorJSON";

@Route("aliments")
@Tags("Aliments")
export class AlimentsController extends Controller {
  /**
   * Retrieves the list of all available aliments in the database.
   * Returns an array containing all aliments with their nutritional information.
   */
  @Get()
  public async getAliments(): Promise<Aliment[]> {
    return new AlimentsService().getAll();
  }

  /**
   * Retrieves the details of an existing aliment.
   * Supply the unique aliment ID and receive corresponding aliment details.
   * @param alimentId The aliment's identifier
   * @example alimentId "52907745-7672-470e-a803-a2f8feb52944"
   */
  @Get("{alimentId}")
  public async getAliment(@Path() alimentId: string): Promise<Aliment> {
    const aliment = await new AlimentsService().get(alimentId);
    if (!aliment) {
      this.setStatus(404);
      throw new Error("Aliment not found");
    }
    return aliment;
  }

  /**
   * Creates a new aliment in the database.
   * Allows adding a new aliment with its nutritional information (calories, proteins, carbohydrates, lipids).
   * @param requestBody The aliment creation parameters including name and nutritional values
   */
  @Response<ValidateErrorJSON>(422, "Validation Failed")
  @SuccessResponse("201", "Created")
  @Post()
  @Security("api_key")
  public async createAliment(
    @Body() requestBody: AlimentCreationParams
  ): Promise<Aliment> {
    this.setStatus(201);
    return await new AlimentsService().create(requestBody);
  }

  /**
   * Updates the information of an existing aliment.
   * Allows partial or complete modification of aliment properties (name, nutritional values).
   * @param alimentId The unique identifier of the aliment to update
   * @param requestBody The fields to update (all fields are optional)
   * @example alimentId "52907745-7672-470e-a803-a2f8feb52944"
   */
  @Response<ValidateErrorJSON>(422, "Validation Failed")
  @SuccessResponse("200", "Updated")
  @Put("{alimentId}")
  @Security("api_key")
  public async updateAliment(
    @Path() alimentId: string,
    @Body() requestBody: Partial<AlimentCreationParams>
  ): Promise<Aliment> {
    const aliment = await new AlimentsService().update(alimentId, requestBody);
    if (!aliment) {
      this.setStatus(404);
      throw new Error("Aliment not found");
    }
    return aliment;
  }

  /**
   * Deletes an aliment from the database.
   * This operation is irreversible. The aliment will be permanently removed from the system.
   * @param alimentId The unique identifier of the aliment to delete
   * @example alimentId "52907745-7672-470e-a803-a2f8feb52944"
   */
  @SuccessResponse("204", "Deleted")
  @Delete("{alimentId}")
  @Security("api_key")
  public async deleteAliment(@Path() alimentId: string): Promise<void> {
    try {
      await new AlimentsService().delete(alimentId);
      this.setStatus(204);
    } catch (error: unknown) {
      const err = error as Error;
      if (err.message.includes("not found") || err.message.includes("Record to delete does not exist")) {
        this.setStatus(404);
        throw new Error("Aliment not found");
      }
      throw error;
    }
  }
}