import { IDeviceRepository } from "../repositories/IDeviceRepository";

export class StoreSession {
  constructor(private repo: IDeviceRepository) {}

  async execute(deviceId: string): Promise<void> {
    try {
      await this.repo.persistSession(deviceId);
    } catch {
      throw new Error("Can't store device_id to storage");
    }
  }
}
