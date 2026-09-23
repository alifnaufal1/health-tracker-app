import { Device } from "../../domain/entities/Device";
import { IDeviceRepository } from "../../domain/repositories/IDeviceRepository";
import * as deviceDatasource from "../datasources/api/device.datasource";
import { DeviceModel } from "../models/DeviceModel";

export class DeviceRepositoryImpl implements IDeviceRepository {
  async getUserDevice(): Promise<Device> {
    const data = await deviceDatasource.getUserDeviceRequest();
    return DeviceModel.fromJson(data).toEntity();
  }

  async registerDevice(device: Device): Promise<Device> {
    const data = await deviceDatasource.registerDeviceRequest(
      device.deviceId,
      device.deviceName,
      device.manufacturerName,
      device.localName,
    );
    return DeviceModel.fromJson(data).toEntity();
  }
}
