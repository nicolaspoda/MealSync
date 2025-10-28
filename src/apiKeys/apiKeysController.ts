import {
  Controller,
  Get,
  Post,
  Route,
  SuccessResponse,
  Response,
  Body,
  Tags,
} from "tsoa";
import {
  ApiKeyCreationParams,
  ApiKeyCreationReturn,
  ApiKeysService,
} from "./apiKeysService";
import ValidateErrorJSON from "../shared/validationErrorJSON";

@Route("api-keys")
@Tags("ApiKeys")
export class ApiKeysController extends Controller {
  private service = new ApiKeysService();

  @Response<ValidateErrorJSON>(422, "Validation Failed")
  @SuccessResponse("201", "Created")
  @Post()
  public async createApiKey(
    @Body() requestBody: ApiKeyCreationParams
  ): Promise<ApiKeyCreationReturn> {
    const apiKey = await this.service.create(requestBody);

    if (apiKey) {
      this.setStatus(201);
      return apiKey;
    } else {
      this.setStatus(500);
      throw new Error();
      // return "error";
    }
  }
}
