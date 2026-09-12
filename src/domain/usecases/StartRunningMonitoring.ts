import { HeartRate } from "../entities/HeartRate";
import { RunData } from "../entities/RunData";
import { IBleRepository } from "../repositories/IBleRepository";

export class StartRunMonitoring {
  private unsubscribeHeartRate: (() => void) | null = null;

  constructor(private repo: IBleRepository) {}

  execute(
    deviceId: string,
    callbacks: {
      onHeartRate: (data: HeartRate) => void;
      onRunData: (data: RunData) => void;
    },
  ): void {
    this.unsubscribeHeartRate = this.repo.streamHeartRate(
      deviceId,
      callbacks.onHeartRate,
    );

    this.repo.startPassiveRunMonitoring(deviceId, callbacks.onRunData);
  }

  stop(): void {
    this.unsubscribeHeartRate?.();
    this.unsubscribeHeartRate = null;
    this.repo.stopPassiveRunMonitoring();
  }
}
