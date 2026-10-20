import { isLoginError, LoginErrorCode } from "@/domain/errors/LoginErrorCode";
import { GENERIC_MESSAGE } from "./genericMessage";

const ERROR_MESSAGES: Record<LoginErrorCode, string> = {
  LOGIN_FAILED: "Fail to sign in.",
  INVALID_CREDENTIALS:
    "The entered credentials do not match the data in the database.",
};

export const toLoginErrorMessage = (error: unknown): string =>
  isLoginError(error) ? ERROR_MESSAGES[error.code] : GENERIC_MESSAGE;

export const INVALID_CREDENTIALS_MESSAGE = ERROR_MESSAGES.INVALID_CREDENTIALS;
export const LOGIN_FAILED_MESSAGE = "Please try signing in again later.";
