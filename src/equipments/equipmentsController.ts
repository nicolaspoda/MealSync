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
  /**
   * Retrieves the list of all available equipments in the database.
   * Returns an array containing all kitchen equipments (oven, microwave, etc.).
   */
  @Get()
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

  /**
   * Creates a new equipment in the database.
   * Allows adding a new kitchen equipment (oven, microwave, blender, etc.).
   * @param requestBody The equipment creation parameters including the name
   */
  @Response<ValidateErrorJSON>(422, "Validation Failed")
  @SuccessResponse("201", "Created")
  @Post()
  @Security("api_key")
  public async createEquipment(
    @Body() requestBody: EquipmentCreationParams
  ): Promise<Equipment> {
    this.setStatus(201);
    return await new EquipmentsService().create(requestBody);
  }

  /**
   * Updates the information of an existing equipment.
   * Allows modifying the name or other properties of an equipment.
   * @param equipmentId The unique identifier of the equipment to update
   * @param requestBody The fields to update (all fields are optional)
   * @example equipmentId "52907745-7672-470e-a803-a2f8feb52944"
   */
  @Response<ValidateErrorJSON>(422, "Validation Failed")
  @SuccessResponse("200", "Updated")
  @Put("{equipmentId}")
  @Security("api_key")
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

  /**
   * Deletes an equipment from the database.
   * This operation is irreversible. The equipment will be permanently removed from the system.
   * @param equipmentId The unique identifier of the equipment to delete
   * @example equipmentId "52907745-7672-470e-a803-a2f8feb52944"
   */
  @SuccessResponse("204", "Deleted")
  @Delete("{equipmentId}")
  @Security("api_key")
  public async deleteEquipment(@Path() equipmentId: string): Promise<void> {
    try {
      await new EquipmentsService().delete(equipmentId);
      this.setStatus(204);
    } catch (error: unknown) {
      const err = error as Error;
      if (err.message.includes("not found") || err.message.includes("Record to delete does not exist")) {
        this.setStatus(404);
        throw new Error("Equipment not found");
      }
      throw error;
    }
  }
}