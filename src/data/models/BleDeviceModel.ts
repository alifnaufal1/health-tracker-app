import { Device } from "react-native-ble-plx";
import { BleDevice } from "../../domain/entities/BleDevice";

export class BleDeviceModel {
  constructor(
    public id: string,
    public name: string | null,
    public localName: string | null,
    public manufacturerData: string | null,
  ) {}

  static fromDevice(device: Device): BleDeviceModel {
    return new BleDeviceModel(
      device.id,
      device.name,
      device.localName,
      device.manufacturerData,
    );
  }

  toEntity(): BleDevice {
    return {
      id: this.id,
      name: this.name,
      localName: this.localName,
    };
  }
}
