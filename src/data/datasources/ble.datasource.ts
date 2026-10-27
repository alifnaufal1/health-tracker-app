import { PermissionsAndroid, PermissionStatus, Platform } from "react-native";
import { BleManager, Device, Subscription } from "react-native-ble-plx";
import {
  DEVICE_NAME,
  HR_CHAR_RX_UUID,
  HR_SERVICE_UUID,
  WO_DATA_CANDIDATES,
  WO_SERVICE_UUID,
} from "../constants/ble.constants";

export const manager = new BleManager();

let activeMonitorSubscriptions: Subscription[] = [];

const worstOf = (statuses: PermissionStatus[]): PermissionStatus => {
  if (statuses.includes("never_ask_again")) return "never_ask_again";
  if (statuses.includes("denied")) return "denied";
  return "granted";
};

export const requestBluetoothPermissions =
  async (): Promise<PermissionStatus> => {
    if (Platform.OS !== "android") return "granted";

    if (Platform.Version >= 31) {
      const result = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
      ]);
      return worstOf(Object.values(result));
    }

    return PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    );
  };

const isTargetDevice = (d: Device) =>
  d.name === DEVICE_NAME || d.localName === DEVICE_NAME;

export class ScanTimeoutError extends Error {
  constructor(public readonly timeoutMs: number) {
    super(`Scan timed out after ${timeoutMs} ms`);
    this.name = "ScanTimeoutError";
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

const scanForDevice = (timeoutMs: number): Promise<Device> =>
  new Promise<Device>((resolve, reject) => {
    const stop = () => manager.stopDeviceScan();

    const timer = setTimeout(() => {
      stop();
      reject(new ScanTimeoutError(timeoutMs));
    }, timeoutMs);

    manager.startDeviceScan(null, null, (error, device) => {
      if (error) {
        clearTimeout(timer);
        stop();
        reject(error);
        return;
      }
      if (device && isTargetDevice(device)) {
        clearTimeout(timer);
        stop();
        resolve(device);
      }
    });
  });

export const scanAndConnect = async (timeoutMs: number): Promise<Device> => {
  let connected = (await manager.connectedDevices([])).find(isTargetDevice);

  if (!connected) {
    const found = await scanForDevice(timeoutMs);
    connected = await found.connect();
  }

  try {
    return await connected.discoverAllServicesAndCharacteristics();
  } catch (error) {
    await connected.cancelConnection().catch(() => undefined);
    throw error;
  }
};

export const disconnectDevice = async (deviceId: string) => {
  await manager.cancelDeviceConnection(deviceId);
};

export const streamHeartRateData = (
  deviceId: string,
  onDataReceived: (base64Value: string) => void,
): Subscription => {
  return manager.monitorCharacteristicForDevice(
    deviceId,
    HR_SERVICE_UUID,
    HR_CHAR_RX_UUID,
    (error, characteristic) => {
      if (error) {
        console.error("Fail to read stream data:", error);
        return;
      }
      if (characteristic?.value) {
        onDataReceived(characteristic.value);
      }
    },
  );
};

export const startPassiveRunMonitoring = (
  deviceId: string,
  onRawData: (charUuid: string, base64Value: string) => void,
): void => {
  stopPassiveRunMonitoring();

  activeMonitorSubscriptions = WO_DATA_CANDIDATES.map((charUuid) =>
    manager.monitorCharacteristicForDevice(
      deviceId,
      WO_SERVICE_UUID,
      charUuid,
      (error, characteristic) => {
        if (error) {
          console.warn(`[monitor ${charUuid}] error:`, error.message);
          return;
        }
        if (characteristic?.value) {
          onRawData(charUuid, characteristic.value);
        }
      },
    ),
  );
};

export const stopPassiveRunMonitoring = (): void => {
  activeMonitorSubscriptions.forEach((sub) => sub.remove());
  activeMonitorSubscriptions = [];
};

export const monitorDeviceDisconnection = (
  deviceId: string,
  onDisconnected: () => void,
) => {
  return manager.onDeviceDisconnected(deviceId, () => {
    onDisconnected();
  });
};
