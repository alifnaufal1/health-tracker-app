export type RegisterErrorCode = "REGISTER_FAILED" | "CONFLICT";

export class RegisterError extends Error {
  constructor(
    public readonly code: RegisterErrorCode,
    message: string,
    public readonly cause?: unknown,
  ) {
    super(message);
    this.name = "RegisterError";
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export const isRegisterError = (
  e: unknown,
  code?: RegisterErrorCode,
): e is RegisterError =>
  e instanceof RegisterError && (code === undefined || e.code === code);
