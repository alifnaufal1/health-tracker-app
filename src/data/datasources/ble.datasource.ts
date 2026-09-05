import { Buffer } from "buffer";
import { PermissionsAndroid, Platform } from "react-native";
import { BleManager, Device } from "react-native-ble-plx";

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

export const scanAndConnectToDevice = async (
  onDeviceFound: (device: Device) => void,
  onConnected: (device: Device) => void,
) => {
  if (isConnecting) return;
  isConnecting = true;

  try {
    const connectedDevices = await manager.connectedDevices([]);
    const existingDevice = connectedDevices.find(
      (d) => d.name === "ZL02CPRO" || d.localName === "ZL02CPRO",
    );

    if (existingDevice) {
      console.log("Device sudah terhubung secara native, mengaitkan ulang...");
      onDeviceFound(existingDevice);

      await existingDevice.discoverAllServicesAndCharacteristics();
      console.log("Services & Characteristics terekspos kembali!");

      onConnected(existingDevice);
      isConnecting = false;
      return;
    }

    console.log("Start to scan...");
    manager.startDeviceScan(null, null, async (error, device) => {
      if (error) {
        console.error("Error when scanning:", error);
        isConnecting = false;
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
        } catch (err) {
          console.error("Fail to connect:", err);
        } finally {
          isConnecting = false;
        }
      }
    });
  } catch (err) {
    console.error("Error checking native connected devices:", err);
    isConnecting = false;
  }
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
        console.error("Gagal membaca stream data:", error);
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
