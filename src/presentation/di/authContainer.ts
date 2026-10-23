import { SessionRepositoryImpl } from "@/data/repositories/SessionRepositoryImpl";
import { GetSavedUserId } from "@/domain/usecases/GetSavedUserId";
import { LoginUser } from "@/domain/usecases/LoginUser";
import { MarkSessionInvalid } from "@/domain/usecases/MarkSessionInvalid";
import { RestoreSession } from "@/domain/usecases/RestoreSession";
import { UserRepositoryImpl } from "../../data/repositories/UserRepositoryImpl";
import { RegisterUser } from "../../domain/usecases/RegisterUser";

const sessionRepo = new SessionRepositoryImpl();
const userRepository = new UserRepositoryImpl();
const loginUser = new LoginUser(userRepository, sessionRepo);

export const authContainer = {
  RegisterUser: new RegisterUser(userRepository, loginUser),
  LoginUser: loginUser,
  GetSavedUserId: new GetSavedUserId(userRepository),
  repository: userRepository,
  restoreSession: new RestoreSession(sessionRepo),
  markSessionInvalid: new MarkSessionInvalid(sessionRepo),
};
