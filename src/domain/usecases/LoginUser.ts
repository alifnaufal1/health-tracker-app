import { User } from "../entities/User";
import { isLoginError } from "../errors/LoginErrorCode";
import { ISessionRepository } from "../repositories/ISessionRepository";
import { IUserRepository } from "../repositories/IUserRepository";

export type LoginResult =
  | { status: "signed_in"; user: User }
  | { status: "sign_in_failed" }
  | { status: "invalid_credentials" };

export class LoginUser {
  constructor(
    private repo: IUserRepository,
    private sessionRepo: ISessionRepository,
  ) {}

  async execute(username: string, password: string): Promise<LoginResult> {
    let user: User;
    try {
      user = await this.repo.login(username, password);
    } catch (error) {
      if (isLoginError(error, "INVALID_CREDENTIALS")) {
        return { status: "invalid_credentials" };
      }
      throw error;
    }
    return user
      ? { status: "signed_in", user: user }
      : { status: "sign_in_failed" };
  }
}
