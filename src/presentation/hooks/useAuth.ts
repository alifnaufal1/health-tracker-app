import { RegisterInput } from "@/domain/entities/RegisterInput";
import { isRegisterError } from "@/domain/errors/RegisterErrorCode";
import { RegisterResult } from "@/domain/usecases/RegisterUser";
import { useEffect, useRef, useState } from "react";
import { Alert } from "react-native";
import { User } from "../../domain/entities/User";
import { authContainer } from "../di/authContainer";
import {
  SIGN_IN_FAILED_MESSAGE,
  toRegisterErrorMessage,
  USERNAME_TAKEN_MESSAGE,
} from "../errors/registerMessages";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isRestoring, setIsRestoring] = useState(true);

  const inFlightRef = useRef(false);

  // useEffect(() => {
  //   const restore = async () => {
  //     const savedUser = await authContainer.GetSavedUserId.execute();
  //     setUser(savedUser);
  //     setIsRestoring(false);
  //   };
  //   restore();
  // }, []);

  const register = async (
    input: RegisterInput,
  ): Promise<RegisterResult | null> => {
    if (inFlightRef.current) return null;
    inFlightRef.current = true;
    setIsLoading(true);

    try {
      const result = await authContainer.RegisterUser.execute(input);

      if (result.status === "signed_in") {
        setUser(result.user);
      } else if (result.status === "username_taken") {
        Alert.alert("Username unavailable", USERNAME_TAKEN_MESSAGE);
      } else {
        Alert.alert("Account created", SIGN_IN_FAILED_MESSAGE);
      }
      return result;
    } catch (error) {
      if (!isRegisterError(error)) {
        console.error("useAuth.register unexpected", error);
      }
      Alert.alert(
        isRegisterError(error) ? "Registration failed" : "Something went wrong",
        toRegisterErrorMessage(error),
      );
      return null;
    } finally {
      inFlightRef.current = false;
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
}
