import { BleDevice } from "../entities/BleDevice";
import { HeartRate } from "../entities/HeartRate";
import { RunData } from "../entities/RunData";

export interface IBleRepository {
  requestPermissions(): Promise<boolean>;

  connect(): Promise<BleDevice>;

  disconnect(deviceId: string): Promise<void>;

  streamHeartRate(
    deviceId: string,
    onData: (heartRate: HeartRate) => void,
  ): () => void;

  startPassiveRunMonitoring(
    deviceId: string,
    onData: (data: RunData) => void,
  ): void;

  stopPassiveRunMonitoring(): void;

  onDeviceDisconnected(
    deviceId: string,
    onDisconnected: () => void,
  ): () => void;
}
