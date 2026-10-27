import { BleDevice } from "../entities/BleDevice";
import { PermissionResult } from "../entities/PermissionResult";
import { isConnectToDeviceError } from "../errors/ConnectToDeviceError";
import { IBleRepository } from "../repositories/IBleRepository";

export type ConnectResult =
  | { status: "connected"; connectedDevice: BleDevice }
  | { status: "rejected" }
  | { status: "blocked" }
  | { status: "bluetooth_off" }
  | { status: "not_found" }
  | { status: "fail" };

export class ConnectToDevice {
  constructor(private repo: IBleRepository) {}

  async execute(): Promise<ConnectResult> {
    let permission: PermissionResult;
    try {
      permission = await this.repo.requestPermissions();
    } catch (error) {
      if (isConnectToDeviceError(error, "REQUEST_PERMISSION")) {
        return { status: "fail" };
      }
      throw error;
    }
    if (permission !== "granted") return { status: permission };

    try {
      const device = await this.repo.connect();
      return { status: "connected", connectedDevice: device };
    } catch (error) {
      if (isConnectToDeviceError(error, "BLUETOOTH_OFF"))
        return { status: "bluetooth_off" };
      if (isConnectToDeviceError(error, "SCAN_TIMEOUT"))
        return { status: "not_found" };
      if (isConnectToDeviceError(error, "CONNECT_FAILED"))
        return { status: "fail" };
      throw error;
    }
  }
}
