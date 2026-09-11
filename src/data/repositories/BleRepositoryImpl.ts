import { BleDevice } from "../../domain/entities/BleDevice";
import { HeartRate } from "../../domain/entities/HeartRate";
import { WorkoutRawData } from "../../domain/entities/WorkoutRawData";
import { IBleRepository } from "../../domain/repositories/IBleRepository";
import * as bleDatasource from "../datasources/ble.datasource";
import { mapToHeartRate } from "../mappers/heartRate.mapper";

export class BleRepositoryImpl implements IBleRepository {
  requestPermissions(): Promise<boolean> {
    return bleDatasource.requestBluetoothPermissions();
  }

  connect(): Promise<BleDevice> {
    return new Promise((resolve, reject) => {
      bleDatasource.scanAndConnectToDevice(
        () => {},
        (device) => {
          resolve({ id: device.id, name: device.name });
        },
        (error) => {
          reject(error);
        },
      );
    });
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
        onData(mapToHeartRate(base64Value));
      },
    );
    return () => subscription.remove();
  }

  startPassiveWorkoutMonitoring(
    deviceId: string,
    onData: (data: WorkoutRawData) => void,
  ): void {
    bleDatasource.startPassiveWorkoutMonitoring(
      deviceId,
      (characteristicId, base64Value) => {
        onData({ characteristicId, base64Value });
      },
    );
  }

  stopPassiveWorkoutMonitoring(): void {
    bleDatasource.stopPassiveWorkoutMonitoring();
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
