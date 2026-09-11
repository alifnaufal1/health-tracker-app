import { BleDevice } from "../entities/BleDevice";
import { HeartRate } from "../entities/HeartRate";
import { WorkoutRawData } from "../entities/WorkoutRawData";

export interface IBleRepository {
  requestPermissions(): Promise<boolean>;

  connect(): Promise<BleDevice>;

  disconnect(deviceId: string): Promise<void>;

  streamHeartRate(
    deviceId: string,
    onData: (heartRate: HeartRate) => void,
  ): () => void;

  startPassiveWorkoutMonitoring(
    deviceId: string,
    onData: (data: WorkoutRawData) => void,
  ): void;

  stopPassiveWorkoutMonitoring(): void;

  onDeviceDisconnected(
    deviceId: string,
    onDisconnected: () => void,
  ): () => void;
}
