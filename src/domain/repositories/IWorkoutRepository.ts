import { Workout } from "../entities/Workout";

export interface IWorkoutRepository {
  getByDeviceId(deviceId: string): Promise<Workout[]>;
}
