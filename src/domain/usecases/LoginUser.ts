import { Auth } from "../entities/Auth";
import { User } from "../entities/User";
import { isAuthSessionError } from "../errors/AuthSessionErrorCode";
import { isLoginError } from "../errors/LoginErrorCode";
import { IAuthSessionRepository } from "../repositories/IAuthSessionRepository";
import { IUserRepository } from "../repositories/IUserRepository";

export type LoginResult =
  | { status: "signed_in"; user: User }
  | { status: "sign_in_failed" }
  | { status: "invalid_credentials" };

export class LoginUser {
  constructor(
    private repo: IUserRepository,
    private authSessionRepo: IAuthSessionRepository,
  ) {}

  async execute(username: string, password: string): Promise<LoginResult> {
    let auth: Auth;
    try {
      auth = await this.repo.login(username, password);
      if (auth.token) {
        await this.authSessionRepo.saveToken(auth.token);
      }
    } catch (error) {
      if (isLoginError(error, "INVALID_CREDENTIALS")) {
        return { status: "invalid_credentials" };
      }
      if (isAuthSessionError(error, "SAVE_FAILED")) {
        return { status: "sign_in_failed" };
      }
      throw error;
    }
    return auth.user
      ? { status: "signed_in", user: auth.user }
      : { status: "sign_in_failed" };
  }
}
