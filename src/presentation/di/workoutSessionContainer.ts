import { WorkoutSessionRepositoryImpl } from "@/data/repositories/WorkoutSessionRepositoryImpl";
import { FinishWorkoutSession } from "@/domain/usecases/FinishWorkoutSession";
import { RecordWorkoutSample } from "@/domain/usecases/RecordWorkoutSample";

const workoutSessionRepository = new WorkoutSessionRepositoryImpl();

export const WorkoutSessionContainer = {
  record: new RecordWorkoutSample(workoutSessionRepository),
  finish: new FinishWorkoutSession(workoutSessionRepository),
  repository: workoutSessionRepository,
};
