import { WorkoutSample, WorkoutSession } from "../entities/WorkoutSample";
import { isWorkoutSessionError } from "../errors/WorkoutSessionErrorCode";
import { IWorkoutSessionRepository } from "../repositories/IWorkoutSessionRepository";

export class RecordWorkoutSample {
  private buffer: WorkoutSample[] = [];
  private lastSavedAt = 0;

  constructor(private repo: IWorkoutSessionRepository) {}

  async execute(
    session: WorkoutSession,
    sample: WorkoutSample,
  ): Promise<boolean> {
    session.samples.push(sample);

    try {
      await this.repo.saveLocal(session);
      return true;
    } catch (error) {
      if (isWorkoutSessionError(error, "SAVE_FAILED")) {
        return false;
      }
      throw error;
    }
  }
}
