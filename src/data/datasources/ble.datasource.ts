import { Buffer } from "buffer";
import { PermissionsAndroid, Platform } from "react-native";
import {
  BleError,
  BleManager,
  Device,
  Subscription,
} from "react-native-ble-plx";
import {
  FEEA_SERVICE_UUID,
  HR_CHAR_RX_UUID,
  HR_SERVICE_UUID,
  WORKOUT_DATA_CANDIDATES,
} from "../constants/ble.constants";

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

let activeMonitorSubscriptions: Subscription[] = [];

export const startPassiveWorkoutMonitoring = (
  deviceId: string,
  onRawData: (charUuid: string, base64Value: string) => void,
): void => {
  stopPassiveWorkoutMonitoring();

  activeMonitorSubscriptions = WORKOUT_DATA_CANDIDATES.map((charUuid) =>
    manager.monitorCharacteristicForDevice(
      deviceId,
      FEEA_SERVICE_UUID,
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

  console.log(
    "Passive workout monitoring aktif (menunggu user start manual di watch).",
  );
};

export const stopPassiveWorkoutMonitoring = (): void => {
  activeMonitorSubscriptions.forEach((sub) => sub.remove());
  activeMonitorSubscriptions = [];
};

export const decodeStandardHeartRate = (base64String: string) => {
  const rawBytes = Buffer.from(base64String, "base64");
  const is16Bit = (rawBytes[0] & 0x01) !== 0;
  const heartRate = is16Bit ? rawBytes.readUInt16LE(1) : rawBytes[1];

  return {
    isValid: true,
    heartRate: heartRate,
  };
};

export const streamWorkoutData = (
  deviceId: string,
  onDataReceived: (bpm: number) => void,
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
        const decoded = decodeStandardHeartRate(characteristic.value);
        if (decoded.isValid) {
          onDataReceived(decoded.heartRate);
        }
      }
    },
  );
};

export const monitorDeviceDisconnection = (
  deviceId: string,
  onDisconnected: () => void,
) => {
  return manager.onDeviceDisconnected(deviceId, (error, device) => {
    console.warn("Device disconnect natively:", error);
    onDisconnected();
  });
};

const COMMAND_WRITE_UUID = "0000fee5-0000-1000-8000-00805f9b34fb";
const HANDSHAKE_PAYLOAD_HEX = "FEEA10065A00";

export const sendHandshake = async (deviceId: string): Promise<void> => {
  const handshakeBase64 = Buffer.from(HANDSHAKE_PAYLOAD_HEX, "hex").toString(
    "base64",
  );
  await manager.writeCharacteristicWithoutResponseForDevice(
    deviceId,
    FEEA_SERVICE_UUID,
    COMMAND_WRITE_UUID,
    handshakeBase64,
  );
  await new Promise((resolve) => setTimeout(resolve, 300));
};

const START_RUN_SEQUENCE: { hex: string; delayMsFromStart: number }[] = [
  { hex: "FEEA20061E01", delayMsFromStart: 0 },
  { hex: "FEEA20066801", delayMsFromStart: 556 },
  { hex: "FEEA20061B00", delayMsFromStart: 1269 },
  { hex: "FEEA20061A00", delayMsFromStart: 1421 },
  { hex: "FEEA2007B91002", delayMsFromStart: 4218 },
  { hex: "FEEA2007B91001", delayMsFromStart: 4498 },
  { hex: "FEEA200C7701000800085A00", delayMsFromStart: 6124 },
  { hex: "FEEA20063302", delayMsFromStart: 6263 },
  { hex: "FEEA2007B60002", delayMsFromStart: 6786 },
  { hex: "FEEA20063304", delayMsFromStart: 6940 },
];

export const replayStartRunSequence = async (
  deviceId: string,
): Promise<boolean> => {
  try {
    const sequenceStartTime = Date.now();
    for (const step of START_RUN_SEQUENCE) {
      const elapsed = Date.now() - sequenceStartTime;
      const waitTime = step.delayMsFromStart - elapsed;
      if (waitTime > 0) await new Promise((r) => setTimeout(r, waitTime));

      const payloadBase64 = Buffer.from(step.hex, "hex").toString("base64");
      await manager.writeCharacteristicWithoutResponseForDevice(
        deviceId,
        FEEA_SERVICE_UUID,
        COMMAND_WRITE_UUID,
        payloadBase64,
      );
    }
    return true;
  } catch (error) {
    console.error("Gagal mengirim rangkaian start-run:", error);
    return false;
  }
};
