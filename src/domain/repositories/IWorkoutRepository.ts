import { Workout } from "../entities/Workout";

export interface IWorkoutRepository {
  getByDeviceId(deviceId: string): Promise<Workout[]>;
  getById(id: string): Promise<Workout>;
}
