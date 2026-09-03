import { Platform } from "react-native";
import { BleManager } from "react-native-ble-plx";

const manager = new BleManager();

export const requestBluetoothPermissions = async () => {
  if (Platform.OS === "android") {
  }
};

export const scanAndConnectToHaylou = (
  onDeviceFound: any,
  onConnected: any,
) => {
  console.log("Start to scan...");

  manager.startDeviceScan(null, null, async (error, device) => {
    if (error) {
      console.error("Error when scanning:", error);
      return;
    }

    if (device && device.name === "ZL02CPRO") {
      console.log("Device found!", device.name);

      manager.stopDeviceScan();
      onDeviceFound(device);

      try {
        // connection proccess
        const connectedDevice = await device.connect();
        console.log("Successfully connect to:", connectedDevice.name);

        // must called before read/write data
        await connectedDevice.discoverAllServicesAndCharacteristics();
        console.log("Services & Characteristics successfully found!");

        onConnected(connectedDevice);
      } catch (err) {
        console.error("Fail to connect:", err);
      }
    }
  });
};
