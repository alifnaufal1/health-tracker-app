import { useEffect, useState } from "react";
import { Alert } from "react-native";
import { User } from "../../domain/entities/User";
import { authContainer } from "../di/authContainer";

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [savedUserId, setSavedUserId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isRestoring, setIsRestoring] = useState(true);

  useEffect(() => {
    const restore = async () => {
      const savedUser = await authContainer.GetSavedUserId.execute();
      setSavedUserId(savedUser?.id || null);
      setUser(savedUser);
      setIsRestoring(false);
    };
    restore();
  }, []);

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
      await authContainer.StoreSession.execute(registeredUser.id);
      setUser(registeredUser);
    } catch (error) {
      Alert.alert("Failed to register user", (error as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  return { user, isLoading, savedUserId, isRestoring, register };
};
