import { RegisterInput } from "../entities/RegisterInput";
import { User } from "../entities/User";
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
    // const credentials = { username: input.username, password: input.password };

    // for (let attempt = 1; attempt <= 2; attempt++) {
    //   try {
    //     return await this.login.execute(credentials);
    //   } catch (error) {
    //     if (!isLoginError(error)) throw error; // bug: jangan disamarkan
    //     if (isLoginError(error, "INVALID_CREDENTIALS")) return null; // diulang pun tetap salah
    //     // kegagalan teknis: lanjut ke percobaan kedua
    //   }
    // }
    return null;
  }
}
