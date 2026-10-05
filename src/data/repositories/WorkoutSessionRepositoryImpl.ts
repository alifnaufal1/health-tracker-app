import { WorkoutSession } from "@/domain/entities/WorkoutSample";
import { WorkoutSessionError } from "@/domain/errors/WorkoutSessionErrorCode";
import { IWorkoutSessionRepository } from "@/domain/repositories/IWorkoutSessionRepository";
import * as WorkoutApiDatasource from "../datasources/api/workout-data.datasource";
import * as WorkoutSessionDatasource from "../datasources/local/session.datasource";
import { workoutMapper } from "../mappers/WorkoutMapper";

export class WorkoutSessionRepositoryImpl implements IWorkoutSessionRepository {
  async saveLocal(session: WorkoutSession): Promise<void> {
    const raw = JSON.stringify(session);
    try {
      await WorkoutSessionDatasource.saveWorkoutSession(session.id, raw);
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

  async deleteLocal(id: string): Promise<void> {
    try {
      await WorkoutSessionDatasource.removeWorkoutSession(id);
    } catch (error) {
      console.error("WorkoutSessionRepo.deleteLocal failed", {
        sessionId: id,
        error,
      });
      throw new WorkoutSessionError(
        "DELETE_FAILED",
        "Failed to delete local workout session",
        error,
      );
    }
  }

  async upload(session: WorkoutSession): Promise<void> {
    const payload = workoutMapper.toWorkoutPayload(session);
    try {
      await WorkoutApiDatasource.create(payload);
    } catch (error) {
      console.warn("WorkoutSessionRepo.upload failed", {
        sessionId: session.id,
        error,
      });
      throw new WorkoutSessionError(
        "UPLOAD_FAILED",
        "Failed to upload workout session",
        error,
      );
    }
  }
}
