import { BleDevice } from "../entities/BleDevice";
import { HeartRate } from "../entities/HeartRate";
import { PermissionResult } from "../entities/PermissionResult";
import { WorkoutSample } from "../entities/WorkoutSample";

export interface IBleRepository {
  /**
   * Requests Bluetooth permissions.
   * Returns the user's decision.
   * Throws ConnectToDeviceError("REQUEST_PERMISSION") if the request fails technically.
   */
  requestPermissions(): Promise<PermissionResult>;

  /**
   * Scans (max ConnectPolicy.scanTimeoutMs) then connects the smartwatch.
   * Returns the device that is ALREADY connected and ready to use.
   * Throws ConnectToDeviceError: BLUETOOTH_OFF | SCAN_TIMEOUT | CONNECT_FAILED.
   * Concurrent calls share a single process.
   */
  connect(): Promise<BleDevice>;

  disconnect(deviceId: string): Promise<void>;

  streamHeartRate(
    deviceId: string,
    onData: (heartRate: HeartRate) => void,
  ): () => void;

  startPassiveWorkoutMonitoring(
    deviceId: string,
    onData: (data: WorkoutSample | null) => void,
  ): void;

  stopPassiveWorkoutMonitoring(): void;

  onDeviceDisconnected(
    deviceId: string,
    onDisconnected: () => void,
  ): () => void;
}
