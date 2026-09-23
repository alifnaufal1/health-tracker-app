import { User } from "../entities/User";
import { IUserRepository } from "../repositories/IUserRepository";

export class GetSavedUserId {
  constructor(private repo: IUserRepository) {}

  async execute(): Promise<User | null> {
    const restored = await this.repo.restoreSession();
    if (!restored) return null;

    try {
      const profile = await this.repo.getProfile();
      return profile;
    } catch {
      await this.repo.logout();
      return null;
    }
  }
}
