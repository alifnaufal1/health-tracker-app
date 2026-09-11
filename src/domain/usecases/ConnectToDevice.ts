import { BleDevice } from "../entities/BleDevice";
import { IBleRepository } from "../repositories/IBleRepository";

export class ConnectToDevice {
  constructor(private repo: IBleRepository) {}

  async execute(): Promise<BleDevice> {
    const hasPermission = await this.repo.requestPermissions();
    if (!hasPermission) {
      throw new Error("Bluetooth permission denied");
    }
    return this.repo.connect();
  }
}
