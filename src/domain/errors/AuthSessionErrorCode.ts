export type AuthSessionErrorCode = "SAVE_FAILED" | "DELETE_FAILED";

export class AuthSessionError extends Error {
  constructor(
    public readonly code: AuthSessionErrorCode,
    message: string,
    public readonly cause?: unknown,
  ) {
    super(message);
    this.name = "AuthSessionError";
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export const isAuthSessionError = (
  e: unknown,
  code?: AuthSessionErrorCode,
): e is AuthSessionError =>
  e instanceof AuthSessionError && (code === undefined || e.code === code);
