import { Device } from "../entities/Device";
import { IDeviceRepository } from "../repositories/IDeviceRepository";

export class GetSavedDevice {
  constructor(private repo: IDeviceRepository) {}

  async execute(): Promise<Device | null> {
    const savedDeviceId = await this.repo.getSavedDeviceId();
    if (!savedDeviceId) return null;

    try {
      return await this.repo.getDeviceById(savedDeviceId);
    } catch {
      await this.repo.clearSession();
      return null;
    }
  }
}
