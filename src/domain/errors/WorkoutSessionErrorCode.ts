export type WorkoutSessionErrorCode =
  | "SAVE_FAILED"
  | "DELETE_FAILED"
  | "UPLOAD_FAILED";

export class WorkoutSessionError extends Error {
  constructor(
    public readonly code: WorkoutSessionErrorCode,
    message: string,
    public readonly cause?: unknown,
  ) {
    super(message);
    this.name = "WorkoutSessionError";
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export const isWorkoutSessionError = (
  e: unknown,
  code?: WorkoutSessionErrorCode,
): e is WorkoutSessionError =>
  e instanceof WorkoutSessionError && (code === undefined || e.code === code);
