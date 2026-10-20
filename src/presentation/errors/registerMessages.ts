import {
  isRegisterError,
  RegisterErrorCode,
} from "@/domain/errors/RegisterErrorCode";
import { GENERIC_MESSAGE } from "./genericMessage";

const ERROR_MESSAGES: Record<RegisterErrorCode, string> = {
  REGISTER_FAILED: "Fail to sign up.",
  CONFLICT:
    "Your username is already used. Try with another username or try to sign in with this user.",
};

export const toRegisterErrorMessage = (error: unknown): string =>
  isRegisterError(error) ? ERROR_MESSAGES[error.code] : GENERIC_MESSAGE;

export const USERNAME_TAKEN_MESSAGE = ERROR_MESSAGES.CONFLICT;
export const REGISTER_FAILED_MESSAGE =
  "Your account was created, but we couldn't sign you in. Please use the Sign in button.";
