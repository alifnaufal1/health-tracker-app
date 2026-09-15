import { Device } from "../../domain/entities/Device";
import { IDeviceRepository } from "../../domain/repositories/IDeviceRepository";
import * as deviceDatasource from "../datasources/api/device.datasource";
import * as sessionDatasource from "../datasources/local/session.datasource";
import { DeviceModel } from "../models/DeviceModel";

export class DeviceRepositoryImpl implements IDeviceRepository {
  async getDeviceById(deviceId: string): Promise<Device> {
    const data = await deviceDatasource.getDeviceRequestById(deviceId);
    return DeviceModel.fromJson(data).toEntity();
  }

  async registerDevice(device: Device): Promise<Device> {
    const data = await deviceDatasource.registerDeviceRequest(
      device.deviceId,
      device.deviceName,
      device.manufacturerName,
      device.localName,
      device.userId,
    );
    return DeviceModel.fromJson(data).toEntity();
  }

  async persistSession(deviceId: string): Promise<void> {
    await sessionDatasource.saveDeviceId(deviceId);
  }

  async getSavedDeviceId(): Promise<string | null> {
    return sessionDatasource.getDeviceId();
  }

  async clearSession(): Promise<void> {
    await sessionDatasource.clearDeviceId();
  }
}
