import { BleDevice } from "../../domain/entities/BleDevice";

export class BleDeviceModel {
  constructor(
    public id: string,
    public name: string | null,
    public localName: string | null,
    public manufacturerData: string | null,
  ) {}

  toEntity(): BleDevice {
    return {
      id: this.id,
      name: this.name,
      localName: this.localName,
    };
  }
}
