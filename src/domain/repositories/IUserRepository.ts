import { User } from "../entities/User";

export interface IUserRepository {
  login(name: string, password: string): Promise<User>;
  register(name: string, nickname: string, password: string): Promise<User>;
  getProfile(): Promise<User>;
  logout(): Promise<void>;
}
