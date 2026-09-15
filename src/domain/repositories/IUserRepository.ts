import { User } from "../entities/User";

export interface IUserRepository {
  login(username: string, password: string): Promise<User>;
  register(
    name: string,
    username: string,
    nickname: string,
    password: string,
  ): Promise<User>;
  getProfile(userId: string): Promise<User>;
  logout(): Promise<void>;
  restoreSession(): Promise<User | null>;
}
