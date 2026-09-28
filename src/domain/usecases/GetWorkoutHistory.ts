import { Workout } from "../entities/Workout";
import { IWorkoutRepository } from "../repositories/IWorkoutRepository";

export class GetWorkoutHistoryUseCase {
  constructor(private repo: IWorkoutRepository) {}

  async execute(deviceId: string): Promise<Workout[]> {
    return await this.repo.getByDeviceId(deviceId);
  }
}
