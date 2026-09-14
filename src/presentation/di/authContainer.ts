import { UserRepositoryImpl } from "../../data/repositories/UserRepositoryImpl";
import { RegisterUser } from "../../domain/usecases/RegisterUser";

const userRepository = new UserRepositoryImpl();

export const authContainer = {
  RegisterUser: new RegisterUser(userRepository),
  repository: userRepository,
};
