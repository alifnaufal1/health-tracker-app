import { Workout } from "../entities/Workout";
import { IWorkoutRepository } from "../repositories/IWorkoutRepository";

export class GetWorkoutDetailUseCase {
  constructor(private repo: IWorkoutRepository) {}

  async execute(id: string): Promise<Workout> {
    return await this.repo.getById(id);
  }
}
