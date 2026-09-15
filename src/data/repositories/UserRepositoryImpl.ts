import { User } from "../../domain/entities/User";
import { IUserRepository } from "../../domain/repositories/IUserRepository";
import { setAuthToken } from "../datasources/api/apiClient";
import * as userDatasource from "../datasources/api/user.datasource";
import * as sessionDatasource from "../datasources/local/session.datasource";
import { UserModel } from "../models/UserModel";

export class UserRepositoryImpl implements IUserRepository {
  async login(username: string, password: string): Promise<User> {
    console.info("~~~[REPO] login().username:", username);
    console.info("~~~[REPO] login().password:", password);

    const data = await userDatasource.loginRequest(username, password);
    console.info("~~~[REPO] login().data:", data);
    setAuthToken(data.token);
    await sessionDatasource.saveSession(data.user, data.token);
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

  async getProfile(userId: string): Promise<User> {
    const data = await userDatasource.getProfileRequest(userId);
    return UserModel.fromJson(data).toEntity();
  }

  async logout(): Promise<void> {
    setAuthToken(null);
    await sessionDatasource.clearSession();
  }

  async restoreSession(): Promise<User | null> {
    const saved = await sessionDatasource.getSession();
    if (!saved) return null;

    setAuthToken(saved.token);

    return saved.user;
  }
}
