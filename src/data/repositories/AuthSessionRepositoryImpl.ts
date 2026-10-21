import { AuthSessionError } from "@/domain/errors/AuthSessionErrorCode";
import { IAuthSessionRepository } from "@/domain/repositories/IAuthSessionRepository";
import { setAuthToken } from "../datasources/api/apiClient";
import * as tokenDatasource from "../datasources/local/token.datasource";

export class AuthSessionRepositoryImpl implements IAuthSessionRepository {
  async saveToken(token: string): Promise<void> {
    try {
      await tokenDatasource.saveToken(token);
    } catch (error) {
      console.error("AuthSessionRepo.saveLocal failed", error);
      throw new AuthSessionError(
        "SAVE_FAILED",
        "Failed to save token locally",
        error,
      );
    }
    setAuthToken(token);
  }
}
