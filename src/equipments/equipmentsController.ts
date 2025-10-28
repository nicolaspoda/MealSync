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
import type { Equipment } from "./equipment";
import { EquipmentCreationParams, EquipmentsService } from "./equipmentsService";
import ValidateErrorJSON from "../shared/validationErrorJSON";

@Route("equipments")
@Tags("Equipments")
export class EquipmentsController extends Controller {
  @Get()
  @Security("api_key")
  public async getEquipments(): Promise<Equipment[]> {
    return new EquipmentsService().getAll();
  }

  /**
   * Retrieves the details of an existing equipment.
   * Supply the unique equipment ID and receive corresponding equipment details.
   * @param equipmentId The equipment's identifier
   * @example equipmentId "52907745-7672-470e-a803-a2f8feb52944"
   */
  @Get("{equipmentId}")
  public async getEquipment(@Path() equipmentId: string): Promise<Equipment> {
    const equipment = await new EquipmentsService().get(equipmentId);
    if (!equipment) {
      this.setStatus(404);
      throw new Error("Equipment not found");
    }
    return equipment;
  }

  @Response<ValidateErrorJSON>(422, "Validation Failed")
  @SuccessResponse("201", "Created")
  @Post()
  public async createEquipment(
    @Body() requestBody: EquipmentCreationParams
  ): Promise<Equipment> {
    this.setStatus(201);
    return await new EquipmentsService().create(requestBody);
  }

  @Response<ValidateErrorJSON>(422, "Validation Failed")
  @SuccessResponse("200", "Updated")
  @Put("{equipmentId}")
  public async updateEquipment(
    @Path() equipmentId: string,
    @Body() requestBody: Partial<EquipmentCreationParams>
  ): Promise<Equipment> {
    const equipment = await new EquipmentsService().update(equipmentId, requestBody);
    if (!equipment) {
      this.setStatus(404);
      throw new Error("Equipment not found");
    }
    return equipment;
  }

  @SuccessResponse("204", "Deleted")
  @Delete("{equipmentId}")
  public async deleteEquipment(@Path() equipmentId: string): Promise<void> {
    const success = await new EquipmentsService().delete(equipmentId);
    if (!success) {
      this.setStatus(404);
      throw new Error("Equipment not found");
    }
    this.setStatus(204);
  }
}