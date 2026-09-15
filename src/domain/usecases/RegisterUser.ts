import { User } from "../entities/User";
import { IUserRepository } from "../repositories/IUserRepository";

export class RegisterUser {
  constructor(private repo: IUserRepository) {}

  async execute(
    name: string,
    nickname: string,
    password: string,
    maxRetries: number = 3,
  ): Promise<User> {
    let lastError: Error | null = null;

    for (let attempt = 0; attempt < maxRetries; attempt++) {
      const username = this.generateUsername(name);
      try {
        return await this.repo.register(name, username, nickname, password);
      } catch (error) {
        lastError = error as Error;
        if (!this.isUsernameConflict(lastError)) {
          throw lastError;
        }
      }
    }

    throw (
      lastError ?? new Error("Fail to register user after several attempts")
    );
  }

  private generateUsername(fullName: string): string {
    const base = fullName
      .trim()
      .split(/\s+/)[0]
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "");
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    return `${base}${randomSuffix}`;
  }

  private isUsernameConflict(error: Error): boolean {
    const message = error.message?.toLowerCase() ?? "";
    return (
      message.includes("username") &&
      (message.includes("exist") ||
        message.includes("taken") ||
        message.includes("duplicate") ||
        message.includes("unique"))
    );
  }
}
