import { WorkoutSession } from "@/domain/entities/WorkoutSample";
import { WorkoutSessionError } from "@/domain/errors/WorkoutSessionErrorCode";
import { IWorkoutSessionRepository } from "@/domain/repositories/IWorkoutSessionRepository";
import * as WorkoutSessionDatasource from "../datasources/local/session.datasource";

export class WorkoutSessionRepositoryImpl implements IWorkoutSessionRepository {
  async saveLocal(session: WorkoutSession): Promise<void> {
    try {
      await WorkoutSessionDatasource.saveWorkoutSession(session);
    } catch (error) {
      console.error("WorkoutSessionRepo.saveLocal failed", {
        sessionId: session.id,
        sampleCount: session.samples.length,
        error,
      });
      throw new WorkoutSessionError(
        "SAVE_FAILED",
        "Failed to save workout session locally",
        error,
      );
    }
  }
  getActive(): Promise<WorkoutSession | null> {
    throw new Error("Method not implemented.");
  }
  getPending(): Promise<WorkoutSession[]> {
    throw new Error("Method not implemented.");
  }
  upload(session: WorkoutSession): Promise<void> {
    throw new Error("Method not implemented.");
  }
  markUploaded(id: string): Promise<void> {
    throw new Error("Method not implemented.");
  }
}
