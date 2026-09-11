import { HeartRate } from "../entities/HeartRate";
import { WorkoutRawData } from "../entities/WorkoutRawData";
import { IBleRepository } from "../repositories/IBleRepository";

export class StartWorkoutMonitoring {
  private unsubscribeHeartRate: (() => void) | null = null;

  constructor(private repo: IBleRepository) {}

  execute(
    deviceId: string,
    callbacks: {
      onHeartRate: (sample: HeartRate) => void;
      onWorkoutData: (data: WorkoutRawData) => void;
    },
  ): void {
    this.unsubscribeHeartRate = this.repo.streamHeartRate(
      deviceId,
      callbacks.onHeartRate,
    );

    this.repo.startPassiveWorkoutMonitoring(deviceId, callbacks.onWorkoutData);
  }

  stop(): void {
    this.unsubscribeHeartRate?.();
    this.unsubscribeHeartRate = null;
    this.repo.stopPassiveWorkoutMonitoring();
  }
}
