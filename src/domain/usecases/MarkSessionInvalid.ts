import { isSessionError } from "../errors/SessionError";
import { ISessionRepository } from "../repositories/ISessionRepository";

export class MarkSessionInvalid {
  constructor(private repo: ISessionRepository) {}

  async execute(): Promise<void> {
    try {
      await this.repo.clear();
    } catch (error) {
      if (isSessionError(error, "CLEAR_FAILED")) return;
      throw error;
    }
  }
}
