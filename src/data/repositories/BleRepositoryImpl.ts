import { PermissionResult } from "@/domain/entities/PermissionResult";
import { WorkoutSample } from "@/domain/entities/WorkoutSample";
import { ConnectToDeviceError } from "@/domain/errors/ConnectToDeviceError";
import { ConnectPolicy } from "@/domain/policies/ConnectPolicy";
import { PermissionStatus } from "react-native";
import { BleError, BleErrorCode, Device } from "react-native-ble-plx";
import { BleDevice } from "../../domain/entities/BleDevice";
import { HeartRate } from "../../domain/entities/HeartRate";
import { IBleRepository } from "../../domain/repositories/IBleRepository";
import * as bleDatasource from "../datasources/ble.datasource";
import { BleMapper } from "../mappers/BleMapper";
import { deviceNotificationMapper } from "../mappers/DeviceNotificationMapper";
import { HeartRateModel } from "../models/HeartRateModel";

const toPermissionResult = (status: PermissionStatus): PermissionResult => {
  switch (status) {
    case "granted":
      return "granted";
    case "denied":
      return "rejected";
    case "never_ask_again":
      return "blocked";
  }
};
export class BleRepositoryImpl implements IBleRepository {
  private inFlight: Promise<BleDevice> | null = null;

  constructor(private policy: ConnectPolicy) {}

  async requestPermissions(): Promise<PermissionResult> {
    let status: PermissionStatus;
    try {
      status = await bleDatasource.requestBluetoothPermissions();
    } catch (error) {
      console.error("BleRepo.requestPermissions failed", error);
      throw new ConnectToDeviceError(
        "REQUEST_PERMISSION",
        "Failed to request Bluetooth permissions",
        error,
      );
    }
    return toPermissionResult(status);
  }

  connect(): Promise<BleDevice> {
    if (!this.inFlight) {
      this.inFlight = this.doConnect().finally(() => {
        this.inFlight = null;
      });
    }
    return this.inFlight;
  }

  private async doConnect(): Promise<BleDevice> {
    let device: Device;
    try {
      device = await bleDatasource.scanAndConnect(this.policy.scanTimeoutMs);
    } catch (error) {
      throw this.toConnectError(error);
    }
    return BleMapper.toEntity(device);
  }

  private toConnectError(error: unknown): ConnectToDeviceError {
    if (error instanceof bleDatasource.ScanTimeoutError) {
      console.warn("BleRepo.connect: scan timeout", {
        timeoutMs: error.timeoutMs,
      });
      return new ConnectToDeviceError(
        "SCAN_TIMEOUT",
        "Smartwatch not found in time",
        error,
      );
    }

    if (
      error instanceof BleError &&
      error.errorCode === BleErrorCode.BluetoothPoweredOff
    ) {
      console.warn("BleRepo.connect: bluetooth is off");
      return new ConnectToDeviceError(
        "BLUETOOTH_OFF",
        "Bluetooth is turned off",
        error,
      );
    }

    console.error("BleRepo.connect failed", {
      message: error instanceof Error ? error.message : String(error),
      errorCode: error instanceof BleError ? error.errorCode : undefined,
    });
    return new ConnectToDeviceError(
      "CONNECT_FAILED",
      "Failed to connect to the smartwatch",
      error,
    );
  }

  async disconnect(deviceId: string): Promise<void> {
    await bleDatasource.disconnectDevice(deviceId);
  }

  streamHeartRate(
    deviceId: string,
    onData: (sample: HeartRate) => void,
  ): () => void {
    const subscription = bleDatasource.streamHeartRateData(
      deviceId,
      (base64Value) => {
        const model = HeartRateModel.fromBase64(base64Value);
        onData(model.toEntity());
      },
    );
    return () => subscription.remove();
  }

  startPassiveWorkoutMonitoring(
    deviceId: string,
    onData: (data: WorkoutSample | null) => void,
  ): void {
    bleDatasource.startPassiveRunMonitoring(deviceId, (_, base64Value) => {
      onData(
        base64Value.startsWith("/")
          ? null
          : deviceNotificationMapper.toEntity(base64Value),
      );
    });
  }

  stopPassiveWorkoutMonitoring(): void {
    bleDatasource.stopPassiveRunMonitoring();
  }

  onDeviceDisconnected(
    deviceId: string,
    onDisconnected: () => void,
  ): () => void {
    const subscription = bleDatasource.monitorDeviceDisconnection(
      deviceId,
      onDisconnected,
    );
    return () => subscription.remove();
  }
}
