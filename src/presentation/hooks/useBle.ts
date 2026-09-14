import { RunData } from "@/domain/entities/RunData";
import { useEffect, useRef, useState } from "react";
import { Alert } from "react-native";
import { BleDevice } from "../../domain/entities/BleDevice";
import { bleContainer } from "../di/bleContainer";

export const useBle = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [activeDevice, setActiveDevice] = useState<BleDevice | null>(null);
  const [heartRate, setHeartRate] = useState<number>(0);
  const [runningData, setRunningData] = useState<RunData | null>(null);
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [time, setTime] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  const disconnectUnsubscribeRef = useRef<(() => void) | null>(null);
  const timerRef = useRef<number>(null);

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

  useEffect(() => {
    if (isTimerRunning) {
      timerRef.current = setInterval(() => {
        setTime((prevTime) => prevTime + 1);
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }

    return () => clearInterval(timerRef.current);
  }, [isTimerRunning]);

  const formatTime = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return [
      hours.toString().padStart(2, "0"),
      minutes.toString().padStart(2, "0"),
      seconds.toString().padStart(2, "0"),
    ].join(":");
  };

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
      Alert.alert("Error", "Smartwatch not connected yet!");
      return;
    }

    bleContainer.startWorkoutMonitoring.execute(activeDevice.id, {
      onHeartRate: (heartRate) => setHeartRate(heartRate.bpm),
      onRunData: (data) => {
        if (data) {
          setRunningData(data);
        } else {
          setIsTimerRunning(!isTimerRunning);
        }
      },
    });

    setIsMonitoring(true);
  };

  const stopMonitoring = () => {
    bleContainer.startWorkoutMonitoring.stop();
    setIsMonitoring(false);
    setIsTimerRunning(false);
  };

  return {
    isConnected,
    isConnecting,
    activeDevice,
    heartRate,
    isMonitoring,
    runningData,
    time,
    isTimerRunning,
    connectToDevice,
    disconnectFromDevice,
    startMonitoring,
    stopMonitoring,
    formatTime,
  };
};
