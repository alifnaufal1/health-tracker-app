import { RegisterInput } from "../entities/RegisterInput";
import { User } from "../entities/User";
import { isLoginError } from "../errors/LoginErrorCode";
import { isRegisterError } from "../errors/RegisterErrorCode";
import { IUserRepository } from "../repositories/IUserRepository";
import { LoginUser } from "./LoginUser";

export type RegisterResult =
  | { status: "signed_in"; user: User }
  | { status: "sign_in_failed" }
  | { status: "username_taken" };

export class RegisterUser {
  constructor(
    private repo: IUserRepository,
    private login: LoginUser,
  ) {}

  async execute(input: RegisterInput): Promise<RegisterResult> {
    try {
      await this.repo.register(input);
    } catch (error) {
      if (isRegisterError(error, "CONFLICT"))
        return { status: "username_taken" };
      throw error;
    }

    const user = await this.signInWithRetry(input);
    return user ? { status: "signed_in", user } : { status: "sign_in_failed" };
  }

  private async signInWithRetry(input: RegisterInput): Promise<User | null> {
    for (let attempt = 1; attempt <= 2; attempt++) {
      try {
        const res = await this.login.execute(input.username, input.password);
        if (res.status === "signed_in") return res.user;
      } catch (error) {
        if (!isLoginError(error)) throw error;
        if (isLoginError(error, "INVALID_CREDENTIALS")) return null;
      }
    }
    return null;
  }
}
