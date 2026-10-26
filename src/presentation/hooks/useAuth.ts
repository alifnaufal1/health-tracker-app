import { RegisterInput } from "@/domain/entities/RegisterInput";
import { isLoginError } from "@/domain/errors/LoginErrorCode";
import { isRegisterError } from "@/domain/errors/RegisterErrorCode";
import { useRef, useState } from "react";
import { Alert } from "react-native";
import { LoginResult, RegisterResult } from "../../domain/entities/User";
import { authContainer } from "../di/authContainer";
import {
  INVALID_CREDENTIALS_MESSAGE,
  LOGIN_FAILED_MESSAGE,
  toLoginErrorMessage,
} from "../errors/loginMessages";
import {
  REGISTER_FAILED_MESSAGE,
  toRegisterErrorMessage,
  USERNAME_TAKEN_MESSAGE,
} from "../errors/registerMessages";
import { useAuthStore } from "../stores/authStore";

export function useAuth() {
  const [isLoading, setIsLoading] = useState(false);

  const inFlightRef = useRef(false);

  const register = async (
    input: RegisterInput,
  ): Promise<RegisterResult | null> => {
    if (inFlightRef.current) return null;
    inFlightRef.current = true;
    setIsLoading(true);

    try {
      const res = await authContainer.RegisterUser.execute(input);

      if (res.status === "signed_in") {
        useAuthStore.setState({
          auth: { status: "signed_in", user: res.user },
        });
      } else if (res.status === "username_taken") {
        Alert.alert("Username unavailable", USERNAME_TAKEN_MESSAGE);
      } else {
        Alert.alert("Account created", REGISTER_FAILED_MESSAGE);
      }
      return res;
    } catch (error) {
      if (!isRegisterError(error)) {
        console.error("useAuth.register unexpected", error);
      }
      Alert.alert(
        isRegisterError(error) ? "Sign up failed" : "Something went wrong",
        toRegisterErrorMessage(error),
      );
      return null;
    } finally {
      inFlightRef.current = false;
      setIsLoading(false);
    }
  };

  const login = async (
    username: string,
    password: string,
  ): Promise<LoginResult | null> => {
    if (inFlightRef.current) return null;
    inFlightRef.current = true;
    setIsLoading(true);

    try {
      const res = await authContainer.LoginUser.execute(username, password);

      if (res.status === "signed_in") {
        useAuthStore.setState({
          auth: { status: "signed_in", user: res.user },
        });
      } else if (res.status === "invalid_credentials") {
        Alert.alert("Wrong username or password", INVALID_CREDENTIALS_MESSAGE);
      } else {
        Alert.alert("Failed to sign in", LOGIN_FAILED_MESSAGE);
      }
      return res;
    } catch (error) {
      if (!isLoginError(error)) {
        console.error("useAuth.login unexpected", error);
      }
      Alert.alert(
        isLoginError(error) ? "Sign in failed" : "Something went wrong",
        toLoginErrorMessage(error),
      );
      return null;
    } finally {
      inFlightRef.current = false;
      setIsLoading(false);
    }
  };

  return { isLoading, register, login };
}
