import { GetSavedUserId } from "@/domain/usecases/GetSavedUserId";
import { LoginUser } from "@/domain/usecases/LoginUser";
import { UserRepositoryImpl } from "../../data/repositories/UserRepositoryImpl";
import { RegisterUser } from "../../domain/usecases/RegisterUser";

const userRepository = new UserRepositoryImpl();
const loginUser = new LoginUser(userRepository);

export const authContainer = {
  RegisterUser: new RegisterUser(userRepository, loginUser),
  LoginUser: loginUser,
  GetSavedUserId: new GetSavedUserId(userRepository),
  repository: userRepository,
};
