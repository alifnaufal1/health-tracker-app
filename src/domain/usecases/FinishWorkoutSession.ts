import { WorkoutSession } from "../entities/WorkoutSample";
import { isWorkoutSessionError } from "../errors/WorkoutSessionErrorCode";
import { IWorkoutSessionRepository } from "../repositories/IWorkoutSessionRepository";

export class FinishWorkoutSession {
  constructor(private repo: IWorkoutSessionRepository) {}

  async execute(
    session: WorkoutSession,
  ): Promise<"uploaded" | "pending_upload"> {
    session.endedAt = Date.now();
    session.status = "pending_upload";

    await this.repo.saveLocal(session);

    try {
      await this.repo.upload(session);
    } catch (error) {
      if (isWorkoutSessionError(error, "UPLOAD_FAILED")) {
        return "pending_upload";
      }
      throw error;
    }

    await this.repo.markUploaded(session.id);
    return "uploaded";
  }
}
