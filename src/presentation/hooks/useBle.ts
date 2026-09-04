import {
  disconnectDevice,
  requestBluetoothPermissions,
  scanAndConnectToDevice,
} from "@/data/datasources/ble.datasource";
import { useState } from "react";
import { Device } from "react-native-ble-plx";

export const useBle = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [activeDevice, setActiveDevice] = useState<Device | null>(null);

  const connectToDevice = async () => {
    setIsConnecting(true);
    const hasPermission = await requestBluetoothPermissions();
    if (!hasPermission) {
      console.error("Permission rejected by user");
      return;
    }

    scanAndConnectToDevice(
      (device) => {
        setActiveDevice(device);
      },
      (connectedDevice) => {
        setIsConnected(true);
        setActiveDevice(connectedDevice);
      },
    );
    setIsConnecting(false);
  };

  const disconnectFromDevice = async () => {
    if (activeDevice) {
      await disconnectDevice(activeDevice.id);
      setIsConnected(false);
      setActiveDevice(null);
    }
  };

  return {
    isConnected,
    isConnecting,
    activeDevice,
    connectToDevice,
    disconnectFromDevice,
  };
};
