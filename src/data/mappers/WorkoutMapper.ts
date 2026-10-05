import { HeartRatePoint, PaceSplit, Workout } from "@/domain/entities/Workout";
import { WorkoutSample, WorkoutSession } from "@/domain/entities/WorkoutSample";
import {
  HeartRateSeriesResponse,
  PaceSplitResponse,
  WorkoutBatchData,
  WorkoutDetailResponse,
  WorkoutPayload,
  WorkoutResponse,
} from "../dto/WorkoutDto";

export const workoutMapper = {
  toPaceSplits(dto: PaceSplitResponse): PaceSplit {
    return {
      avgHeartRate: dto.avg_heart_rate,
      paceSecPerKm: dto.pace,
      type: dto.type,
    };
  },
  toHeartRateSeries(dto: HeartRateSeriesResponse): HeartRatePoint {
    return {
      heartRate: dto.heart_rate,
      timestamp: new Date(dto.timestamp),
    };
  },
  toEntity(dto: WorkoutResponse): Workout {
    return {
      id: dto.workout_data_id,
      type: dto.workout_data_type,
      steps: dto.total_steps,
      calories: dto.total_calories,
      distanceMeters: dto.total_distance,
      avgHeartRate: dto.avg_heart_rate,
      maxHeartRate: dto.max_heart_rate,
      avgPaceSecPerKm: dto.avg_pace,
      durationSeconds: dto.duration,
      startedAt: new Date(dto.started_at),
      deviceId: dto.device_id,
    };
  },
  fromDetailToEntity(dto: WorkoutDetailResponse): Workout {
    return {
      id: dto.workout_data_id,
      type: dto.workout_data_type,
      steps: dto.total_steps,
      calories: dto.total_calories,
      distanceMeters: dto.total_distance,
      avgHeartRate: dto.avg_heart_rate,
      maxHeartRate: dto.max_heart_rate,
      avgPaceSecPerKm: dto.avg_pace,
      bestPaceSecPerKm: dto.best_pace,
      durationSeconds: dto.duration,
      startedAt: new Date(dto.started_at),
      paceSplits: dto.pace_splits.map((d) => this.toPaceSplits(d)),
      heartRateSeries: dto.heart_rate_series.map((d) =>
        this.toHeartRateSeries(d),
      ),
      deviceId: dto.device_id,
    };
  },
  toBatchData(sample: WorkoutSample): WorkoutBatchData {
    return {
      steps: sample.steps,
      distance: sample.distance,
      calories: sample.calories,
      heart_rate: sample.heartRate ?? 0,
      pace: Math.round(sample.pace ?? 0),
      timestamp: new Date(sample.timestamp)
        .toISOString()
        .replace(/\.\d+Z$/, "Z"),
    };
  },
  toWorkoutPayload(session: WorkoutSession): WorkoutPayload {
    return {
      device_id: session.deviceId,
      workout_data_type: "running",
      workout_batch_data: session.samples.map((d) => this.toBatchData(d)),
    };
  },
};
