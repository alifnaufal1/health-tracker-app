import { Auth } from "../entities/Auth";
import { RegisterInput } from "../entities/RegisterInput";
import { User } from "../entities/User";

export interface IUserRepository {
  login(username: string, password: string): Promise<Auth>;
  register(input: RegisterInput): Promise<User>;
  getProfile(): Promise<User>;
  logout(): Promise<void>;
  restoreSession(): Promise<boolean>;
}
