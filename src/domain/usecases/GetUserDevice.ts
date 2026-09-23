import { Device } from "../entities/Device";
import { IDeviceRepository } from "../repositories/IDeviceRepository";

export class GetUserDevice {
  constructor(private repo: IDeviceRepository) {}

  async execute(): Promise<Device | null> {
    return await this.repo.getUserDevice();
  }
}
