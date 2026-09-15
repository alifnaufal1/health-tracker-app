import { User } from "../entities/User";
import { IUserRepository } from "../repositories/IUserRepository";

export class LoginUser {
  constructor(private repo: IUserRepository) {}

  async execute(username: string, password: string): Promise<User> {
    return await this.repo.login(username, password);
  }
}
