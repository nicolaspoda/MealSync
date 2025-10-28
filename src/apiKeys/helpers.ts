import crypto from "crypto";

const genApiKey = (): string => {
  const randomBytes = crypto.randomBytes(32).toString("hex");
  return `ms_live_${randomBytes}`;
};

const hashKey = (apiKey: string): string => {
  return crypto.createHash("sha256").update(apiKey).digest("hex");
};

export { genApiKey, hashKey };
