import { Auth } from "@/domain/entities/Auth";
import { RegisterInput } from "@/domain/entities/RegisterInput";
import { LoginError } from "@/domain/errors/LoginErrorCode";
import { RegisterError } from "@/domain/errors/RegisterErrorCode";
import { User } from "../../domain/entities/User";
import { IUserRepository } from "../../domain/repositories/IUserRepository";
import { setAuthToken } from "../datasources/api/apiClient";
import * as userDatasource from "../datasources/api/user.datasource";
import * as tokenDatasource from "../datasources/local/token.datasource";
import { LoginUserResponse, RegisterUserResponse } from "../dto/UserDto";
import { AuthMapper } from "../mappers/AuthMapper";
import { UserMapper } from "../mappers/UserMapper";
import { UserModel } from "../models/UserModel";
import { toHttpErrorInfo } from "../utils/httpError";

export class UserRepositoryImpl implements IUserRepository {
  async login(username: string, password: string): Promise<Auth> {
    let dto: LoginUserResponse;
    try {
      dto = await userDatasource.loginRequest(username, password);
    } catch (error) {
      const info = toHttpErrorInfo(error);

      if (info.status === 401) {
        console.warn("UserRepo.login invalid", username);
        throw new LoginError(
          "INVALID_CREDENTIALS",
          "The password or email/username entered does not match",
          info,
        );
      }

      console.error("UserRepo.login failed", {
        username,
        ...info,
      });
      throw new LoginError("LOGIN_FAILED", "Failed to sign in", info);
    }
    return AuthMapper.toEntity(dto);
  }

  async register(input: RegisterInput): Promise<User> {
    let dto: RegisterUserResponse;
    try {
      dto = await userDatasource.registerRequest(input);
    } catch (error) {
      const info = toHttpErrorInfo(error);

      if (info.status === 409) {
        console.warn("UserRepo.register conflict", {
          username: input.username,
        });
        throw new RegisterError("CONFLICT", "Username already taken", info);
      }

      console.error("UserRepo.register failed", {
        username: input.username,
        ...info,
      });
      throw new RegisterError(
        "REGISTER_FAILED",
        "Failed to register this user",
        info,
      );
    }
    return UserMapper.toEntity(dto);
  }

  async getProfile(): Promise<User> {
    const data = await userDatasource.getProfileRequest();
    return UserModel.fromJson(data).toEntity();
  }

  async logout(): Promise<void> {
    setAuthToken(null);
    await tokenDatasource.clearToken();
  }

  async restoreSession(): Promise<boolean> {
    const token = await tokenDatasource.getToken();
    console.info("token:", token);
    if (!token) return false;

    setAuthToken(token);
    return true;
  }
}
