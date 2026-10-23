import { Auth } from "../entities/Auth";
import type { User } from "../entities/User";

export type StoredSession = {
  user: User;
  tokenExpiresAt: number | null;
};

export interface ISessionRepository {
  save(authData: Auth): Promise<void>;
  read(): Promise<StoredSession | null>;
  clear(): Promise<void>;
}
