import { Workout } from "@/domain/entities/Workout";
import { IWorkoutRepository } from "@/domain/repositories/IWorkoutRepository";
import * as WorkoutDatasource from "../datasources/api/workout-data.datasource";
import { workoutMapper } from "../mappers/WorkoutMapper";

export class WorkoutRepositoryImpl implements IWorkoutRepository {
  async getById(id: string): Promise<Workout> {
    const dto = await WorkoutDatasource.fetchById(id);
    return workoutMapper.fromDetailToEntity(dto);
  }
  async getByDeviceId(deviceId: string): Promise<Workout[]> {
    const dtos = await WorkoutDatasource.fetchByDeviceId(deviceId);
    return dtos.map((d) => workoutMapper.toEntity(d));
  }
}
