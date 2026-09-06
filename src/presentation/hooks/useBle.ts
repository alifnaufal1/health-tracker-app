import {
  disconnectDevice,
  requestBluetoothPermissions,
  scanAndConnectToDevice,
  streamWorkoutData,
} from "@/data/datasources/ble.datasource";
import { useState } from "react";
import { Alert } from "react-native";
import { BleErrorCode, Device } from "react-native-ble-plx";

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

    await scanAndConnectToDevice(
      (device) => {
        setActiveDevice(device);
      },
      (connectedDevice) => {
        setIsConnected(true);
        setActiveDevice(connectedDevice);
      },
      (error) => {
        if (error.errorCode === BleErrorCode.BluetoothPoweredOff) {
          Alert.alert(
            "Bluetooth Off",
            "Please turn on Bluetooth on your phone to connect the smartwatch.",
          );
        } else if (error.errorCode === BleErrorCode.LocationServicesDisabled) {
          Alert.alert(
            "Location Off",
            "Please turn on your phone's GPS/Location.",
          );
        } else {
          Alert.alert("Scan Failed", "There is an error:" + error.message);
        }
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
