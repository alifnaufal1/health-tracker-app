import { useEffect, useRef, useState } from "react";
import { Alert } from "react-native";
import { BleDevice } from "../../domain/entities/BleDevice";
import { bleContainer } from "../di/BleContainer";

export const useBle = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [activeDevice, setActiveDevice] = useState<BleDevice | null>(null);
  const [heartRate, setHeartRate] = useState<number>(0);
  const [isMonitoring, setIsMonitoring] = useState(false);

  const disconnectUnsubscribeRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    if (!activeDevice) return;

    disconnectUnsubscribeRef.current =
      bleContainer.repository.onDeviceDisconnected(activeDevice.id, () => {
        setIsConnected(false);
        setActiveDevice(null);
        setIsMonitoring(false);
        bleContainer.startWorkoutMonitoring.stop();
      });

    return () => {
      disconnectUnsubscribeRef.current?.();
    };
  }, [activeDevice]);

  const connectToDevice = async () => {
    setIsConnecting(true);
    try {
      const device = await bleContainer.connectToDevice.execute();
      setActiveDevice(device);
      setIsConnected(true);
    } catch (error) {
      Alert.alert("Fail to Connect", (error as Error).message);
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectFromDevice = async () => {
    if (!activeDevice) return;
    await bleContainer.disconnectDevice.execute(activeDevice.id);
    setIsConnected(false);
    setActiveDevice(null);
    setIsMonitoring(false);
    bleContainer.startWorkoutMonitoring.stop();
  };

  const startMonitoring = () => {
    if (!activeDevice) {
      Alert.alert("Error", "Smartwatch belum terhubung!");
      return;
    }

    bleContainer.startWorkoutMonitoring.execute(activeDevice.id, {
      onHeartRate: (heartRate) => setHeartRate(heartRate.bpm),
      onWorkoutData: (data) => {
        console.log(
          `[workout data ${data.characteristicId}]`,
          data.base64Value,
        );
      },
    });

    setIsMonitoring(true);
  };

  const stopMonitoring = () => {
    bleContainer.startWorkoutMonitoring.stop();
    setIsMonitoring(false);
  };

  return {
    isConnected,
    isConnecting,
    activeDevice,
    heartRate,
    isMonitoring,
    connectToDevice,
    disconnectFromDevice,
    startMonitoring,
    stopMonitoring,
  };
};
