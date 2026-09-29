import { WorkoutRepositoryImpl } from "@/data/repositories/WorkoutRepositoryImpl";
import { GetWorkoutDetailUseCase } from "@/domain/usecases/GetWorkoutDetail";
import { GetWorkoutHistoryUseCase } from "@/domain/usecases/GetWorkoutHistory";

const workoutRepository = new WorkoutRepositoryImpl();

export const WorkoutContainer = {
  getWorkoutHistory: new GetWorkoutHistoryUseCase(workoutRepository),
  getWorkoutDetail: new GetWorkoutDetailUseCase(workoutRepository),
  repository: workoutRepository,
};
