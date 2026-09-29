import { HeartRatePoint, PaceSplit, Workout } from "@/domain/entities/Workout";
import {
  HeartRateSeriesResponse,
  PaceSplitResponse,
  WorkoutDetailResponse,
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
};
