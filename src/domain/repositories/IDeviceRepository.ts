import { Device } from "../entities/Device";

export interface IDeviceRepository {
  registerDevice(device: Device): Promise<Device>;
  getDeviceById(deviceId: string): Promise<Device>;
  persistSession(deviceId: string): Promise<void>;
  getSavedDeviceId(): Promise<string | null>;
  clearSession(): Promise<void>;
}
