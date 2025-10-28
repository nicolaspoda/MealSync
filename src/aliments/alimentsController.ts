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
  @Get()
  @Security("api_key")
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

  @Response<ValidateErrorJSON>(422, "Validation Failed")
  @SuccessResponse("201", "Created")
  @Post()
  public async createAliment(
    @Body() requestBody: AlimentCreationParams
  ): Promise<Aliment> {
    this.setStatus(201);
    return await new AlimentsService().create(requestBody);
  }

  @Response<ValidateErrorJSON>(422, "Validation Failed")
  @SuccessResponse("200", "Updated")
  @Put("{alimentId}")
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

  @SuccessResponse("204", "Deleted")
  @Delete("{alimentId}")
  public async deleteAliment(@Path() alimentId: string): Promise<void> {
    const success = await new AlimentsService().delete(alimentId);
    if (!success) {
      this.setStatus(404);
      throw new Error("Aliment not found");
    }
    this.setStatus(204);
  }
}