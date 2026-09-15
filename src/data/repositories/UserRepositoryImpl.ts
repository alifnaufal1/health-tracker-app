import { User } from "../../domain/entities/User";
import { IUserRepository } from "../../domain/repositories/IUserRepository";
import * as userDatasource from "../datasources/api/user.datasource";
import * as sessionDatasource from "../datasources/session.datasource";
import { UserModel } from "../models/UserModel";

export class UserRepositoryImpl implements IUserRepository {
  async login(email: string, password: string): Promise<User> {
    const data = await userDatasource.loginRequest(email, password);
    // setAuthToken(data.token);
    return UserModel.fromJson(data.user).toEntity();
  }

  async register(
    name: string,
    nick_name: string,
    password: string,
  ): Promise<User> {
    const data = await userDatasource.registerRequest(
      name,
      nick_name,
      password,
    );
    console.info(data);
    // setAuthToken(data.token);
    return UserModel.fromJson(data).toEntity();
  }

  async getProfile(userId: string): Promise<User> {
    const data = await userDatasource.getProfileRequest(userId);
    return UserModel.fromJson(data).toEntity();
  }

  async logout(): Promise<void> {
    // setAuthToken(null);
  }

  async persistSession(userId: string): Promise<void> {
    await sessionDatasource.saveUserId(userId);
  }

  async getSavedUserId(): Promise<string | null> {
    return sessionDatasource.getUserId();
  }

  async clearSession(): Promise<void> {
    await sessionDatasource.clearUserId();
  }
}
