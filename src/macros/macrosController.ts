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
import type { Macro } from "./macro";
import { MacroCreationParams, MacrosService } from "./macrosService";
import ValidateErrorJSON from "../shared/validationErrorJSON";

@Route("macros")
@Tags("Macros")
export class MacrosController extends Controller {
  /**
   * Retrieves the list of all available macros in the database.
   * Returns an array containing all macronutrients (proteins, carbohydrates, lipids).
   */
  @Get()
  public async getMacros(): Promise<Macro[]> {
    return new MacrosService().getAll();
  }

  /**
   * Retrieves the details of an existing macro.
   * Supply the unique macro ID and receive corresponding macro details.
   * @param macroId The macro's identifier
   * @example macroId "52907745-7672-470e-a803-a2f8feb52944"
   */
  @Get("{macroId}")
  public async getMacro(@Path() macroId: string): Promise<Macro> {
    const macro = await new MacrosService().get(macroId);
    if (!macro) {
      this.setStatus(404);
      throw new Error("Macro not found");
    }
    return macro;
  }

  /**
   * Creates a new macro in the database.
   * Allows adding a new macronutrient (proteins, carbohydrates, lipids) with its information.
   * @param requestBody The macro creation parameters including the name
   */
  @Response<ValidateErrorJSON>(422, "Validation Failed")
  @SuccessResponse("201", "Created")
  @Post()
  @Security("api_key")
  public async createMacro(
    @Body() requestBody: MacroCreationParams
  ): Promise<Macro> {
    this.setStatus(201);
    return await new MacrosService().create(requestBody);
  }

  /**
   * Updates the information of an existing macro.
   * Allows modifying the name or other properties of a macro.
   * @param macroId The unique identifier of the macro to update
   * @param requestBody The fields to update (all fields are optional)
   * @example macroId "52907745-7672-470e-a803-a2f8feb52944"
   */
  @Response<ValidateErrorJSON>(422, "Validation Failed")
  @SuccessResponse("200", "Updated")
  @Put("{macroId}")
  @Security("api_key")
  public async updateMacro(
    @Path() macroId: string,
    @Body() requestBody: Partial<MacroCreationParams>
  ): Promise<Macro> {
    const macro = await new MacrosService().update(macroId, requestBody);
    if (!macro) {
      this.setStatus(404);
      throw new Error("Macro not found");
    }
    return macro;
  }

  /**
   * Deletes a macro from the database.
   * This operation is irreversible. The macro will be permanently removed from the system.
   * @param macroId The unique identifier of the macro to delete
   * @example macroId "52907745-7672-470e-a803-a2f8feb52944"
   */
  @SuccessResponse("204", "Deleted")
  @Delete("{macroId}")
  @Security("api_key")
  public async deleteMacro(@Path() macroId: string): Promise<void> {
    try {
      await new MacrosService().delete(macroId);
      this.setStatus(204);
    } catch (error: unknown) {
      const err = error as Error;
      if (err.message.includes("not found") || err.message.includes("Record to delete does not exist")) {
        this.setStatus(404);
        throw new Error("Macro not found");
      }
      throw error;
    }
  }
}