import { SplitType } from "@/domain/entities/Workout";

export interface WorkoutDetailResponse {
  workout_data_id: string;
  workout_data_type: string;
  total_steps: number;
  total_distance: number;
  total_calories: number;
  avg_heart_rate: number;
  max_heart_rate: number;
  avg_pace: number;
  best_pace: number;
  duration: number;
  heart_rate_series: HeartRateSeriesResponse[];
  pace_splits: PaceSplitResponse[];
  started_at: string;
  ended_at: string;
  device_id: string;
}

export interface WorkoutResponse {
  workout_data_id: string;
  workout_data_type: string;
  total_steps: number;
  total_distance: number;
  total_calories: number;
  avg_heart_rate: number;
  max_heart_rate: number;
  avg_pace: number;
  duration: number;
  started_at: string;
  device_id: string;
}

export interface HeartRateSeriesResponse {
  heart_rate: number;
  timestamp: string;
}

export interface PaceSplitResponse {
  pace: number;
  avg_heart_rate: number;
  type: SplitType;
}
