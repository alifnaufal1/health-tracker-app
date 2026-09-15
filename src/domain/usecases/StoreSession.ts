import { IUserRepository } from "../repositories/IUserRepository";

export class StoreSession {
  constructor(private repo: IUserRepository) {}

  async execute(userId: string): Promise<void> {
    try {
      await this.repo.persistSession(userId);
    } catch {
      throw new Error("Can't store user_id to storage");
    }
  }
}
