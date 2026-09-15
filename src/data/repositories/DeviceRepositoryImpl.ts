import { Device } from "../../domain/entities/Device";
import { IDeviceRepository } from "../../domain/repositories/IDeviceRepository";
import * as deviceDatasource from "../datasources/api/device.datasource";
import { DeviceModel } from "../models/DeviceModel";

export class DeviceRepositoryImpl implements IDeviceRepository {
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
}
