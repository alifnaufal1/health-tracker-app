import { WorkoutSessionRepositoryImpl } from "@/data/repositories/WorkoutSessionRepositoryImpl";
import { WorkoutPolicy } from "@/domain/policies/WorkoutPolicy";
import { FinishWorkoutSession } from "@/domain/usecases/FinishWorkoutSession";
import { RecordWorkoutSample } from "@/domain/usecases/RecordWorkoutSample";

const policy: WorkoutPolicy = __DEV__
  ? { minUploadDurationMs: 0, checkpointIntervalMs: 0 }
  : { minUploadDurationMs: 60_000, checkpointIntervalMs: 30_000 };

const repo = new WorkoutSessionRepositoryImpl();

export const WorkoutSessionContainer = {
  record: new RecordWorkoutSample(repo, policy),
  finish: new FinishWorkoutSession(repo, policy),
};
