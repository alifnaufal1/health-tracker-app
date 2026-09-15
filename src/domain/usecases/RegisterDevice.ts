import { Device } from "../entities/Device";
import { IDeviceRepository } from "../repositories/IDeviceRepository";

export class RegisterDevice {
  constructor(private repo: IDeviceRepository) {}

  async execute(device: Device): Promise<Device> {
    if (!device.userId) throw new Error("User not registered yet");
    if (!device.deviceId) throw new Error("Device not connected yet");

    return this.repo.registerDevice(device);
  }
}
