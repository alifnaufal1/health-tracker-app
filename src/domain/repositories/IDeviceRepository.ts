import { Device } from "../entities/Device";

export interface IDeviceRepository {
  registerDevice(device: Device): Promise<Device>;
}
