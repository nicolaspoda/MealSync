import { prisma } from "../shared/prisma";
import { ApiKey } from "./apiKey";
import { genApiKey, hashKey } from "./helpers";

export type ApiKeyCreationParams = Pick<ApiKey, "name"> & { expires?: number };
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

    let expiresAt;
    if (apiKeyCreationParams.expires) {
      const now = new Date();
      now.setDate(now.getDate() + apiKeyCreationParams.expires);
      expiresAt = now;
    }

    const apiKeyData = await prisma.apiKey.create({
      data: {
        keyHash: hashedApiKey,
        name: apiKeyCreationParams.name,
        expiresAt: expiresAt,
      },
    });

    return {
      apiKey: apiKey,
      createdAt: apiKeyData.createdAt,
      expiresAt: expiresAt,
    };
  }
}
