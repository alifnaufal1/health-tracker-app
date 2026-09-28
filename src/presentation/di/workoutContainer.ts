import { WorkoutRepositoryImpl } from "@/data/repositories/WorkoutRepositoryImpl";
import { GetWorkoutHistoryUseCase } from "@/domain/usecases/GetWorkoutHistory";

const workoutRepository = new WorkoutRepositoryImpl();

export const WorkoutContainer = {
  getWorkoutHistory: new GetWorkoutHistoryUseCase(workoutRepository),
  repository: workoutRepository,
};
