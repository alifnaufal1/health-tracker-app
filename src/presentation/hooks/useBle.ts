import {
  disconnectDevice,
  monitorDeviceDisconnection,
  requestBluetoothPermissions,
  scanAndConnectToDevice,
  startPassiveWorkoutMonitoring,
  stopPassiveWorkoutMonitoring,
  streamWorkoutData,
} from "@/data/datasources/ble.datasource";
import { useEffect, useRef, useState } from "react";
import { Alert } from "react-native";
import { BleErrorCode, Device, Subscription } from "react-native-ble-plx";

export const useBle = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [activeDevice, setActiveDevice] = useState<Device | null>(null);
  const [heartRate, setHeartRate] = useState<number>(0);
  const [isMonitoring, setIsMonitoring] = useState(false);

  const heartRateSubscriptionRef = useRef<Subscription | null>(null);
  const disconnectSubscriptionRef = useRef<Subscription | null>(null);

  useEffect(() => {
    if (!activeDevice) return;

    disconnectSubscriptionRef.current = monitorDeviceDisconnection(
      activeDevice.id,
      () => {
        setIsConnected(false);
        setActiveDevice(null);
        setIsMonitoring(false);
        stopHeartRateStream();
        stopPassiveWorkoutMonitoring();
        console.log("Device disconnect natively, state reset to default.");
      },
    );

    return () => {
      disconnectSubscriptionRef.current?.remove();
    };
  }, [activeDevice]);

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
      stopHeartRateStream();
    }
  };

  const startHeartRateStream = (deviceId?: string) => {
    if (!deviceId) {
      Alert.alert("Start Workout Failed", "Device disconnected");
      return;
    }
    heartRateSubscriptionRef.current?.remove();
    heartRateSubscriptionRef.current = streamWorkoutData(deviceId, (bpm) => {
      setHeartRate(bpm);
    });
  };

  const stopHeartRateStream = () => {
    heartRateSubscriptionRef.current?.remove();
    heartRateSubscriptionRef.current = null;
  };

  const startMonitoring = () => {
    if (!activeDevice) {
      Alert.alert("Error", "Smartwatch belum terhubung!");
      return;
    }

    startHeartRateStream(activeDevice.id);
    startPassiveWorkoutMonitoring(activeDevice.id, (charUuid, rawValue) => {
      // TODO: decode data tambahan (distance/steps/dll) kalau sudah
      console.log(`[data ${charUuid}]`, rawValue);
    });

    setIsMonitoring(true);
  };

  const stopMonitoring = () => {
    stopHeartRateStream();
    stopPassiveWorkoutMonitoring();
    setIsMonitoring(false);
  };

  return {
    isConnected,
    isConnecting,
    activeDevice,
    heartRate,
    isRunning: heartRateSubscriptionRef.current !== null ? true : false,
    isMonitoring,
    connectToDevice,
    disconnectFromDevice,
    startHeartRateStream,
    stopHeartRateStream,
    startMonitoring,
    stopMonitoring,
  };
};
