export type SessionErrorCode =
  | "READ_FAILED"
  | "CORRUPTED"
  | "CLEAR_FAILED"
  | "SAVE_FAILED";

export class SessionError extends Error {
  constructor(
    public readonly code: SessionErrorCode,
    message: string,
    public readonly cause?: unknown,
  ) {
    super(message);
    this.name = "SessionError";
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export const isSessionError = (
  e: unknown,
  code?: SessionErrorCode,
): e is SessionError =>
  e instanceof SessionError && (code === undefined || e.code === code);
