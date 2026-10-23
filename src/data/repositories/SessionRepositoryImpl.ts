import { Auth } from "@/domain/entities/Auth";
import { SessionError } from "@/domain/errors/SessionError";
import {
  ISessionRepository,
  StoredSession,
} from "@/domain/repositories/ISessionRepository";
import * as tokenDatasource from "../datasources/local/token.datasource";
import * as userStorageDatasource from "../datasources/local/userStorage.datasource";
import { UserMapper } from "../mappers/UserMapper";
import { readTokenExpiry } from "../utils/jwt";

export class SessionRepositoryImpl implements ISessionRepository {
  async save(authData: Auth): Promise<void> {
    try {
      await Promise.all([
        tokenDatasource.saveToken(authData.token),
        userStorageDatasource.saveUserRaw(JSON.stringify(authData.user)),
      ]);
    } catch (error) {
      console.error("SessionRepo.save failed", {
        message: error instanceof Error ? error.message : String(error),
      });
      throw new SessionError(
        "SAVE_FAILED",
        "Failed to save the stored session",
        error,
      );
    }
  }
  async read(): Promise<StoredSession | null> {
    let token: string | null;
    let rawUser: string | null;
    try {
      [token, rawUser] = await Promise.all([
        tokenDatasource.getToken(),
        userStorageDatasource.getUserRaw(),
      ]);
    } catch (error) {
      console.error("SessionRepo.read failed", {
        message: error instanceof Error ? error.message : String(error),
      });
      throw new SessionError(
        "READ_FAILED",
        "Failed to read the stored session",
        error,
      );
    }

    if (!token && !rawUser) return null;
    if (!token || !rawUser) {
      console.warn("SessionRepo.read: incomplete session");
      throw new SessionError("CORRUPTED", "Stored session is incomplete");
    }

    try {
      return {
        user: UserMapper.toEntity(JSON.parse(rawUser)),
        tokenExpiresAt: readTokenExpiry(token),
      };
    } catch (error) {
      console.warn("SessionRepo.read: corrupted user data");
      throw new SessionError(
        "CORRUPTED",
        "Stored user data is unreadable",
        error,
      );
    }
  }

  async clear(): Promise<void> {
    const results = await Promise.allSettled([
      tokenDatasource.removeToken(),
      userStorageDatasource.removeUser(),
    ]);
    const failed = results.filter((r) => r.status === "rejected");
    if (failed.length > 0) {
      console.error("SessionRepo.clear failed", { failedCount: failed.length });
      throw new SessionError(
        "CLEAR_FAILED",
        "Failed to clear the stored session",
      );
    }
  }
}
