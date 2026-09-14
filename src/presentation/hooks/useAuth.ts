import { useState } from "react";
import { Alert } from "react-native";
import { User } from "../../domain/entities/User";
import { authContainer } from "../di/authContainer";

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const register = async (
    name: string,
    nick_name: string,
    password: string,
  ) => {
    setIsLoading(true);
    try {
      const registeredUser = await authContainer.RegisterUser.execute(
        name,
        nick_name,
        password,
      );
      setUser(registeredUser);
    } catch (error) {
      Alert.alert("Failed to register", (error as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  return { user, isLoading, register };
};
