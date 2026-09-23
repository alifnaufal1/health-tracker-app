import { User } from "../../domain/entities/User";
import { IUserRepository } from "../../domain/repositories/IUserRepository";
import { setAuthToken } from "../datasources/api/apiClient";
import * as userDatasource from "../datasources/api/user.datasource";
import * as tokenDatasource from "../datasources/local/token.datasource";
import { UserModel } from "../models/UserModel";

export class UserRepositoryImpl implements IUserRepository {
  async login(username: string, password: string): Promise<User> {
    const data = await userDatasource.loginRequest(username, password);
    await tokenDatasource.saveToken(data.token);
    setAuthToken(data.token);
    return UserModel.fromJson(data.user).toEntity();
  }

  async register(
    name: string,
    username: string,
    nickname: string,
    password: string,
  ): Promise<User> {
    const data = await userDatasource.registerRequest(
      name,
      username,
      nickname,
      password,
    );
    return UserModel.fromJson(data).toEntity();
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
