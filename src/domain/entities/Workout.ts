export type SplitType = "warmup" | "fastest" | "cooldown" | "normal";

export type PaceSplit = {
  paceSecPerKm: number;
  avgHeartRate: number;
  type: SplitType;
};

export type HeartRatePoint = {
  timestamp: Date;
  heartRate: number;
};

export type Workout = {
  id: string;
  type: string;
  steps: number;
  calories: number;
  distanceMeters: number;
  avgHeartRate: number;
  maxHeartRate: number;
  avgPaceSecPerKm: number;
  bestPaceSecPerKm: number;
  durationSeconds: number;
  startedAt: Date;
  heartRateSeries: HeartRatePoint[];
  paceSplits: PaceSplit[];
  deviceId: string;
};
