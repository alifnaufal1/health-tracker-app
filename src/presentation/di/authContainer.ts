import { GetSavedUserId } from "@/domain/usecases/GetSavedUserId";
import { StoreSession } from "@/domain/usecases/StoreSession";
import { UserRepositoryImpl } from "../../data/repositories/UserRepositoryImpl";
import { RegisterUser } from "../../domain/usecases/RegisterUser";

const userRepository = new UserRepositoryImpl();

export const authContainer = {
  RegisterUser: new RegisterUser(userRepository),
  GetSavedUserId: new GetSavedUserId(userRepository),
  StoreSession: new StoreSession(userRepository),
  repository: userRepository,
};
