import { WorkoutSession } from "../entities/WorkoutSample";
import { isWorkoutSessionError } from "../errors/WorkoutSessionErrorCode";
import { WorkoutPolicy } from "../policies/WorkoutPolicy";
import { IWorkoutSessionRepository } from "../repositories/IWorkoutSessionRepository";

export type FinishResult =
  | "uploaded"
  | "pending_upload"
  | "discarded_too_short";

export class FinishWorkoutSession {
  constructor(
    private repo: IWorkoutSessionRepository,
    private policy: WorkoutPolicy,
  ) {}

  async execute(session: WorkoutSession): Promise<FinishResult> {
    session.endedAt = Date.now();

    if (this.isTooShort(session)) {
      await this.deleteQuietly(session.id);
      return "discarded_too_short";
    }

    session.status = "pending_upload";
    await this.repo.saveLocal(session);

    try {
      await this.repo.upload(session);
    } catch (error) {
      if (isWorkoutSessionError(error, "UPLOAD_FAILED"))
        return "pending_upload";
      throw error;
    }

    await this.deleteQuietly(session.id);
    return "uploaded";
  }

  private isTooShort(session: WorkoutSession): boolean {
    if (session.samples.length === 0) return true;
    const duration = (session.endedAt ?? Date.now()) - session.startedAt;
    return duration < this.policy.minUploadDurationMs;
  }

  private async deleteQuietly(id: string): Promise<void> {
    try {
      await this.repo.deleteLocal(id);
    } catch (error) {
      if (isWorkoutSessionError(error, "DELETE_FAILED")) return;
      throw error;
    }
  }
}
