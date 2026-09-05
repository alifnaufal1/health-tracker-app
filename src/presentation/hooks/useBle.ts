import {
  disconnectDevice,
  requestBluetoothPermissions,
  scanAndConnectToDevice,
  streamWorkoutData,
} from "@/data/datasources/ble.datasource";
import { useState } from "react";
import { Device } from "react-native-ble-plx";

export const useBle = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [activeDevice, setActiveDevice] = useState<Device | null>(null);
  const [heartRate, setHeartRate] = useState<number>(0);

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

  const startHeartRateStream = (
    deviceId: string,
    serviceUUID: string,
    rxUUID: string,
  ) => {
    streamWorkoutData(deviceId, serviceUUID, rxUUID, (bpm) => {
      setHeartRate(bpm);
    });
  };

  return {
    isConnected,
    isConnecting,
    activeDevice,
    heartRate,
    connectToDevice,
    disconnectFromDevice,
    startHeartRateStream,
  };
};
