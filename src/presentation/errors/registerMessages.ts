import {
  isRegisterError,
  RegisterErrorCode,
} from "@/domain/errors/RegisterErrorCode";

const ERROR_MESSAGES: Record<RegisterErrorCode, string> = {
  REGISTER_FAILED: "Fail to register.",
  CONFLICT:
    "Your username is already used. Try with another username or try to login with this user.",
};

const GENERIC_MESSAGE = "Something went wrong. Please try again.";

export const toRegisterErrorMessage = (error: unknown): string =>
  isRegisterError(error) ? ERROR_MESSAGES[error.code] : GENERIC_MESSAGE;

export const USERNAME_TAKEN_MESSAGE = ERROR_MESSAGES.CONFLICT;

export const SIGN_IN_FAILED_MESSAGE =
  "Your account was created, but we couldn't sign you in. Please use the Sign in button.";
