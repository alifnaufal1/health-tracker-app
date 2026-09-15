import { Device } from "../../domain/entities/Device";

export class DeviceModel {
  constructor(
    public device_id: string,
    public device_name: string,
    public manufacturer_name: string,
    public local_name: string,
    public user_id: string,
  ) {}

  static fromJson(json: any): DeviceModel {
    return new DeviceModel(
      json.device_id,
      json.device_name,
      json.manufacturer_name,
      json.local_name,
      json.user_id,
    );
  }

  toEntity(): Device {
    return {
      deviceId: this.device_id,
      deviceName: this.device_name,
      manufacturerName: this.manufacturer_name,
      localName: this.local_name,
      userId: this.user_id,
    };
  }
}
