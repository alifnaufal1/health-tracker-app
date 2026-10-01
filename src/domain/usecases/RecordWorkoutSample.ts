import { WorkoutSample, WorkoutSession } from "../entities/WorkoutSample";
import { isWorkoutSessionError } from "../errors/WorkoutSessionErrorCode";
import { WorkoutPolicy } from "../policies/WorkoutPolicy";
import { IWorkoutSessionRepository } from "../repositories/IWorkoutSessionRepository";

export class RecordWorkoutSample {
  constructor(
    private repo: IWorkoutSessionRepository,
    private policy: WorkoutPolicy,
  ) {}

  async execute(session: WorkoutSession, sample: WorkoutSample): Promise<void> {
    session.samples.push(sample); // selalu dicatat di memori, tanpa throttle

    const last = session.lastCheckpointAt ?? 0;
    if (sample.timestamp - last < this.policy.checkpointIntervalMs) return;
    session.lastCheckpointAt = sample.timestamp; 

    try {
      await this.repo.saveLocal(session);
    } catch (error) {
      if (isWorkoutSessionError(error, "SAVE_FAILED")) return;
      throw error;
    }
  }
}
