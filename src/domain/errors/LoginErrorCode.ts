export type LoginErrorCode = "LOGIN_FAILED" | "INVALID_CREDENTIALS";

export class LoginError extends Error {
  constructor(
    public readonly code: LoginErrorCode,
    message: string,
    public readonly cause?: unknown,
  ) {
    super(message);
    this.name = "LoginError";
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export const isLoginError = (
  e: unknown,
  code?: LoginErrorCode,
): e is LoginError =>
  e instanceof LoginError && (code === undefined || e.code === code);
