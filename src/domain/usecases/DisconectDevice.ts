import { IBleRepository } from "../repositories/IBleRepository";

export class DisconnectDevice {
  constructor(private repo: IBleRepository) {}

  async execute(deviceId: string): Promise<void> {
    return this.repo.disconnect(deviceId);
  }
}
