import { Device } from "react-native-ble-plx";
import { BleDevice } from "../../domain/entities/BleDevice";

export class BleDeviceModel {
  constructor(
    public id: string,
    public name: string | null,
    public rssi: number | null,
    public mtu: number,
  ) {}

  static fromDevice(device: Device): BleDeviceModel {
    return new BleDeviceModel(device.id, device.name, device.rssi, device.mtu);
  }

  toEntity(): BleDevice {
    return {
      id: this.id,
      name: this.name,
    };
  }
}
