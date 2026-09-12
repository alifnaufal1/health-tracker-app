import { BleDevice } from "../../domain/entities/BleDevice";
import { HeartRate } from "../../domain/entities/HeartRate";
import { RunData } from "../../domain/entities/RunData";
import { IBleRepository } from "../../domain/repositories/IBleRepository";
import * as bleDatasource from "../datasources/ble.datasource";
import { BleDeviceModel } from "../models/BleDeviceModel";
import { HeartRateModel } from "../models/HeartRateModel";
import { RunRawDataModel } from "../models/RunRawDataModel";

export class BleRepositoryImpl implements IBleRepository {
  requestPermissions(): Promise<boolean> {
    return bleDatasource.requestBluetoothPermissions();
  }

  connect(): Promise<BleDevice> {
    return new Promise((resolve, reject) => {
      bleDatasource.scanAndConnectToDevice(
        () => {},
        (device) => {
          const model = BleDeviceModel.fromDevice(device);
          resolve(model.toEntity());
        },
        (error) => reject(error),
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
        const model = HeartRateModel.fromBase64(base64Value);
        onData(model.toEntity());
      },
    );
    return () => subscription.remove();
  }

  startPassiveRunMonitoring(
    deviceId: string,
    onData: (data: RunData) => void,
  ): void {
    bleDatasource.startPassiveRunMonitoring(
      deviceId,
      (characteristicId, base64Value) => {
        const model = RunRawDataModel.fromNotification(
          characteristicId,
          base64Value,
        );
        onData(model.toEntity());
      },
    );
  }

  stopPassiveRunMonitoring(): void {
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
