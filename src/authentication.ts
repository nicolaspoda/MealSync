import * as express from "express";
import { hashKey } from "./apiKeys/helpers";
import { prisma } from "./shared/prisma";

export async function expressAuthentication(
  request: express.Request,
  securityName: string,
  scopes?: string[]
): Promise<any> {
  if (securityName === "api_key") {
    let token;
    if (request.headers && request.headers["x-api-key"]) {
      token = request.headers["x-api-key"];
    }

    if (!token) {
      request.res?.status(401).json({ message: "invalid or missing api key" });
      return Promise.reject({});
    }

    const hashedToken = hashKey(token as string);

    const dbToken = await prisma.apiKey.findFirst({
      where: {
        keyHash: hashedToken,
      },
    });

    if (!dbToken || !dbToken.isActive) {
      request.res?.status(401).json({ message: "invalid or missing api key" });
      return Promise.reject({});
    }

    return Promise.resolve({ id: 1, name: "IronMan" });

    // if (token === "abc123456") {
    //   return Promise.resolve({
    //     id: 1,
    //     name: "Ironman",
    //   });
    // } else {
    //   request.res?.status(401).json({ message: "invalid or missing api key" });
    //   return Promise.reject({});
    // }
  }

  return Promise.reject({});
}
