import { Workout } from "@/domain/entities/Workout";
import { IWorkoutRepository } from "@/domain/repositories/IWorkoutRepository";
import * as WorkoutDatasource from "../datasources/api/workout-data.datasource";
import { workoutMapper } from "../mappers/WorkoutMapper";

export class WorkoutRepositoryImpl implements IWorkoutRepository {
  async getByDeviceId(deviceId: string): Promise<Workout[]> {
    const dtos = await WorkoutDatasource.fetchByDeviceId(deviceId);
    return dtos.map(workoutMapper.toEntity);
  }
}
