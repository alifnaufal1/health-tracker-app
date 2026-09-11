import { PermissionsAndroid, Platform } from "react-native";
import {
  BleError,
  BleManager,
  Device,
  Subscription,
} from "react-native-ble-plx";
import {
  HR_CHAR_RX_UUID,
  HR_SERVICE_UUID,
  WO_DATA_CANDIDATES,
  WO_SERVICE_UUID,
} from "../constants/ble.constants";

export const manager = new BleManager();

let isConnecting = false;
let activeMonitorSubscriptions: Subscription[] = [];

export const requestBluetoothPermissions = async (): Promise<boolean> => {
  if (Platform.OS !== "android") return true;

  if (Platform.Version >= 31) {
    const granted = await PermissionsAndroid.requestMultiple([
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    ]);

    return (
      granted[PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN] ===
        PermissionsAndroid.RESULTS.GRANTED &&
      granted[PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT] ===
        PermissionsAndroid.RESULTS.GRANTED &&
      granted[PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION] ===
        PermissionsAndroid.RESULTS.GRANTED
    );
  }

  const granted = await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
  );
  return granted === PermissionsAndroid.RESULTS.GRANTED;
};

export const scanAndConnectToDevice = (
  onDeviceFound: (device: Device) => void,
  onConnected: (device: Device) => void,
  onError: (error: BleError) => void,
): Promise<void> => {
  return new Promise(async (resolve, reject) => {
    if (isConnecting) {
      resolve();
      return;
    }
    isConnecting = true;

    try {
      const connectedDevices = await manager.connectedDevices([]);
      const existingDevice = connectedDevices.find(
        (d) => d.name === "ZL02CPRO" || d.localName === "ZL02CPRO",
      );

      if (existingDevice) {
        onDeviceFound(existingDevice);
        await existingDevice.discoverAllServicesAndCharacteristics();
        onConnected(existingDevice);
        isConnecting = false;
        resolve();
        return;
      }

      manager.startDeviceScan(null, null, async (error, device) => {
        if (error) {
          isConnecting = false;
          manager.stopDeviceScan();
          onError(error);
          reject(error);
          return;
        }

        if (
          device &&
          (device.name === "ZL02CPRO" || device.localName === "ZL02CPRO")
        ) {
          manager.stopDeviceScan();
          onDeviceFound(device);

          try {
            const connectedDevice = await device.connect();
            await connectedDevice.discoverAllServicesAndCharacteristics();
            onConnected(connectedDevice);
            resolve();
          } catch (err) {
            onError(err as BleError);
            reject(err);
          } finally {
            isConnecting = false;
          }
        }
      });
    } catch (err) {
      isConnecting = false;
      onError(err as BleError);
      reject(err);
    }
  });
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

export const startPassiveWorkoutMonitoring = (
  deviceId: string,
  onRawData: (charUuid: string, base64Value: string) => void,
): void => {
  stopPassiveWorkoutMonitoring();

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

export const stopPassiveWorkoutMonitoring = (): void => {
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
