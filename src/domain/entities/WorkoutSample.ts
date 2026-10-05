export type WorkoutSample = {
  timestamp: number;
  steps: number;
  distance: number;
  calories: number;
  heartRate?: number;
  pace?: number;
};

export type WorkoutSession = {
  id: string;
  deviceId: string;
  startedAt: number;
  endedAt?: number;
  samples: WorkoutSample[];
  status: "recording" | "pending_upload";
  lastCheckpointAt?: number;
};
