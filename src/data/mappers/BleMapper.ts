import { BleDevice } from "@/domain/entities/BleDevice";
import { Device } from "react-native-ble-plx";

export const BleMapper = {
  toEntity(dto: Device): BleDevice {
    return {
      id: dto.id,
      name: dto.name,
      localName: dto.localName,
    };
  },
};
