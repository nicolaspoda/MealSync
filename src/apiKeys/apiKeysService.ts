import { prisma } from "../shared/prisma";
import { ApiKey } from "./apiKey";
import { genApiKey, hashKey } from "./helpers";

export type ApiKeyCreationParams = Pick<ApiKey, "name">;
export type ApiKeyCreationReturn = {
  apiKey: string;
  createdAt: Date;
  expiresAt?: Date;
};

export class ApiKeysService {
  public async create(
    apiKeyCreationParams: ApiKeyCreationParams
  ): Promise<ApiKeyCreationReturn> {
    const apiKey = genApiKey();
    const hashedApiKey = hashKey(apiKey);

    const apiKeyData = await prisma.apiKey.create({
      data: {
        keyHash: hashedApiKey,
        name: apiKeyCreationParams.name,
      },
    });

    return {
      apiKey: apiKey,
      createdAt: apiKeyData.createdAt,
    };
  }
}
