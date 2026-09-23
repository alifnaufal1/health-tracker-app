import { useEffect, useState } from "react";
import { Alert } from "react-native";
import { User } from "../../domain/entities/User";
import { authContainer } from "../di/authContainer";

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isRestoring, setIsRestoring] = useState(true);

  useEffect(() => {
    const restore = async () => {
      const savedUser = await authContainer.GetSavedUserId.execute();
      setUser(savedUser);
      setIsRestoring(false);
    };
    restore();
  }, []);

  const register = async (name: string, nickname: string, password: string) => {
    setIsLoading(true);
    try {
      const registeredUser = await authContainer.RegisterUser.execute(
        name,
        nickname,
        password,
      );
      setUser(registeredUser);
      await login(registeredUser.username, password);
    } catch (error) {
      Alert.alert("Failed to register user", (error as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (username: string, password: string) => {
    setIsLoading(true);
    try {
      const user = await authContainer.LoginUser.execute(username, password);

      setUser(user);
    } catch (error) {
      Alert.alert("Failed to login", (error as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  return { user, isLoading, isRestoring, register };
};
