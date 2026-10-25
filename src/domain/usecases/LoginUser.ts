import { Auth } from "../entities/Auth";
import { LoginResult } from "../entities/User";
import { isAuthSessionError } from "../errors/AuthSessionErrorCode";
import { isLoginError } from "../errors/LoginErrorCode";
import { ISessionRepository } from "../repositories/ISessionRepository";
import { IUserRepository } from "../repositories/IUserRepository";

export class LoginUser {
  constructor(
    private repo: IUserRepository,
    private sessionRepo: ISessionRepository,
  ) {}

  async execute(username: string, password: string): Promise<LoginResult> {
    let auth: Auth;
    try {
      auth = await this.repo.login(username, password);
      if (auth.token) {
        await this.sessionRepo.save(auth);
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
