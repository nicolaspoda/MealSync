import * as express from "express";

export function expressAuthentication(
  request: express.Request,
  securityName: string,
  scopes?: string[]
): Promise<any> {
  if (securityName === "api_key") {
    let token;
    if (request.headers && request.headers["x-api-key"]) {
      token = request.headers["x-api-key"];
    }

    // Get API key from environment variable
    const validApiKey = process.env.API_KEY || "abc123456"; // Fallback for backward compatibility

    if (token === validApiKey) {
      return Promise.resolve({
        id: 1,
        name: "Ironman",
      });
    } else {
      request.res?.status(401).json({ message: "invalid or missing api key" });
      return Promise.reject({});
    }
  }

  return Promise.reject({});
}
