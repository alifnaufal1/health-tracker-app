import { Device } from "../entities/Device";
import { IDeviceRepository } from "../repositories/IDeviceRepository";

export class RegisterDevice {
  constructor(private repo: IDeviceRepository) {}

  async execute(device: Device): Promise<Device> {
    if (!device.deviceId) throw new Error("Device not connected yet");

    return this.repo.registerDevice(device);
  }
}
