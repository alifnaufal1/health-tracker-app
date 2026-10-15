import { isRegisterError, RegisterErrorCode } from "./RegisterErrorCode";
import { genericToUserMessage } from "./general";

const MESSAGES: Record<RegisterErrorCode, string> = {
  REGISTER_FAILED: "Fail to register.",
  CONFLICT:
    "Your username is already used. Try with another username or try to login with this user.",
};

export const toUserMessage = (error: unknown): string =>
  genericToUserMessage(isRegisterError, MESSAGES, error);
