import { UUID } from "../shared/uuid";

export interface ApiKey {
  id: UUID;
  keyHash: string;
  name?: string | null;
  createdAt: Date;
  lastUsedAt: Date | null;
  expiresAt: Date | null;
  isActive: boolean;
}
