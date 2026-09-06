import { Buffer } from "buffer";
import { PermissionsAndroid, Platform } from "react-native";
import { BleError, BleManager, Device } from "react-native-ble-plx";

const manager = new BleManager();
let isConnecting = false;

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
        console.log("Device is already connected natively, reconnecting...");
        onDeviceFound(existingDevice);

        await existingDevice.discoverAllServicesAndCharacteristics();
        console.log("Services & Characteristics revealed once again!");

        onConnected(existingDevice);
        isConnecting = false;
        resolve();
        return;
      }

      console.log("Start to scan...");
      manager.startDeviceScan(null, null, async (error, device) => {
        if (error) {
          console.error("Error when scanning:", error);
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
          console.log("Device found!", device.name);
          manager.stopDeviceScan();
          onDeviceFound(device);

          try {
            const connectedDevice = await device.connect();
            await connectedDevice.discoverAllServicesAndCharacteristics();
            console.log("Successfully connected and discovered!");
            onConnected(connectedDevice);
            resolve();
          } catch (err) {
            console.error("Fail to connect:", err);
            onError(err as BleError);
            reject(err);
          } finally {
            isConnecting = false;
          }
        }
      });
    } catch (err) {
      console.error("Error checking native connected devices:", err);
      isConnecting = false;
      onError(err as BleError);
      reject(err);
    }
  });
};

export const disconnectDevice = async (deviceId: string) => {
  try {
    await manager.cancelDeviceConnection(deviceId);
    console.log("Device successfully disconnected");
  } catch (err) {
    console.error("Error disconnecting device:", err);
  }
};

export const decodeHaylouPayload = (base64String: string) => {
  const rawBytes = Buffer.from(base64String, "base64");
  console.info("~~~ble.datasource.decodeHaylouPayload.rawBytes:", rawBytes);

  if (rawBytes[0] === 0xfe && rawBytes[1] === 0xea && rawBytes[3] === 0x0c) {
    const heartRate = rawBytes[10];
    console.info("~~~ble.datasource.decodeHaylouPayload.heartRate:", heartRate);

    return {
      isValid: true,
      heartRate: heartRate,
    };
  }

  return { isValid: false, heartRate: 0 };
};

export const streamWorkoutData = (
  deviceId: string,
  serviceUUID: string,
  characteristicRX_UUID: string,
  onDataReceived: (bpm: number) => void,
) => {
  manager.monitorCharacteristicForDevice(
    deviceId,
    serviceUUID,
    characteristicRX_UUID,
    (error, characteristic) => {
      if (error) {
        console.error("Fail to read stream data:", error);
        return;
      }

      if (characteristic?.value) {
        const decoded = decodeHaylouPayload(characteristic.value);
        if (decoded.isValid) {
          onDataReceived(decoded.heartRate);
        }
      }
    },
  );
};
