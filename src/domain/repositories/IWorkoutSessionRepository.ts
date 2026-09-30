import { WorkoutSession } from "../entities/WorkoutSample";

export interface IWorkoutSessionRepository {
  saveLocal(session: WorkoutSession): Promise<void>;
  getActive(): Promise<WorkoutSession | null>;
  getPending(): Promise<WorkoutSession[]>;
  upload(session: WorkoutSession): Promise<void>;
  markUploaded(id: string): Promise<void>;
}
