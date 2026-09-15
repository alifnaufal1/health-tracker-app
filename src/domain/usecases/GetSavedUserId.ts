import { User } from "../entities/User";
import { IUserRepository } from "../repositories/IUserRepository";

export class GetSavedUserId {
  constructor(private repo: IUserRepository) {}

  async execute(): Promise<User | null> {
    const savedUserId = await this.repo.getSavedUserId();
    console.info("savedUserId:", savedUserId);
    if (!savedUserId) return null;

    try {
      return await this.repo.getProfile(savedUserId);
    } catch {
      await this.repo.clearSession();
      return null;
    }
  }
}
