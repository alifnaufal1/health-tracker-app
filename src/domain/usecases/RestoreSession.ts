import { SettledAuthState } from "../entities/AuthState";
import { isSessionError } from "../errors/SessionError";
import {
  ISessionRepository,
  StoredSession,
} from "../repositories/ISessionRepository";

export class RestoreSession {
  constructor(
    private repo: ISessionRepository,
    private now: () => number = Date.now,
  ) {}

  async execute(): Promise<SettledAuthState> {
    let stored: StoredSession | null;
    try {
      stored = await this.repo.read();
    } catch (error) {
      if (isSessionError(error, "CORRUPTED")) {
        await this.clearQuietly();
        return { status: "signed_out" };
      }
      if (isSessionError(error, "READ_FAILED")) {
        return { status: "signed_out" };
      }
      throw error;
    }

    if (!stored) return { status: "signed_out" };

    const expired =
      stored.tokenExpiresAt !== null && stored.tokenExpiresAt <= this.now();
    if (expired) {
      await this.clearQuietly();
      return { status: "signed_out" };
    }

    return { status: "signed_in", user: stored.user };
  }

  private async clearQuietly(): Promise<void> {
    try {
      await this.repo.clear();
    } catch (error) {
      if (isSessionError(error, "CLEAR_FAILED")) return;
      throw error;
    }
  }
}
