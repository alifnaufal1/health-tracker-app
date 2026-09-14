import { User } from "../entities/User";
import { IUserRepository } from "../repositories/IUserRepository";

export class RegisterUser {
  constructor(private repo: IUserRepository) {}

  async execute(
    name: string,
    nick_name: string,
    password: string,
  ): Promise<User> {
    if (password.length < 8 && password.length > 12) {
      throw new Error("Password length must between 8 until 12");
    }
    return this.repo.register(name, nick_name, password);
  }
}
