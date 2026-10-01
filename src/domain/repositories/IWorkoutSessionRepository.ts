import { WorkoutSession } from "../entities/WorkoutSample";

export interface IWorkoutSessionRepository {
  saveLocal(session: WorkoutSession): Promise<void>;
  deleteLocal(id: string): Promise<void>;
  upload(session: WorkoutSession): Promise<void>;
}
