import { HeartRate } from "../entities/HeartRate";
import { WorkoutSample } from "../entities/WorkoutSample";
import { IBleRepository } from "../repositories/IBleRepository";

export class StartRunMonitoring {
  private unsubscribeHeartRate: (() => void) | null = null;

  constructor(private repo: IBleRepository) {}

  execute(
    deviceId: string,
    callbacks: {
      onHeartRate: (data: HeartRate) => void;
      onWorkout: (data: WorkoutSample | null) => void;
    },
  ): void {
    this.unsubscribeHeartRate = this.repo.streamHeartRate(
      deviceId,
      callbacks.onHeartRate,
    );

    this.repo.startPassiveWorkoutMonitoring(deviceId, callbacks.onWorkout);
  }

  stop(): void {
    this.unsubscribeHeartRate?.();
    this.unsubscribeHeartRate = null;
    this.repo.stopPassiveWorkoutMonitoring();
  }
}
