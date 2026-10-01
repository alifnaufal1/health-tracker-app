import { WorkoutSample } from "@/domain/entities/WorkoutSample";
import { useEffect, useRef, useState } from "react";
import { BleDevice } from "../../domain/entities/BleDevice";
import { bleContainer } from "../di/bleContainer";

export const useBle = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [activeDevice, setActiveDevice] = useState<BleDevice | null>(null);
  const [heartRate, setHeartRate] = useState<number>(0);
  const [runningData, setRunningData] = useState<WorkoutSample | null>(null);
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [time, setTime] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  const connectToDevice = async () => {
    setIsConnecting(true);
    try {
      const device = await bleContainer.connectToDevice.execute();
      setActiveDevice(device);
      setIsConnected(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unknown error");
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectFromDevice = async () => {
    if (!activeDevice) return;
    try {
      await bleContainer.disconnectDevice.execute(activeDevice.id);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unknown error");
    } finally {
      setIsConnected(false);
      setActiveDevice(null);
      setIsMonitoring(false);
      bleContainer.startWorkoutMonitoring.stop();
    }
  };

  const startMonitoring = async (): Promise<boolean> => {
    if (!activeDevice) {
      setError("Smartwatch not connected yet!");
      return false;
    }
    setRunningData(null);
    setHeartRate(0);
    setTime(0);
    setIsTimerRunning(false);

    try {
      await bleContainer.startWorkoutMonitoring.execute(activeDevice.id, {
        onHeartRate: (hr) => setHeartRate(hr.bpm),
        onWorkout: (data) => {
          if (data) setRunningData(data);
          else setIsTimerRunning((prev) => !prev);
        },
      });
      setIsMonitoring(true);
      return true;
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unknown error");
      return false;
    }
  };

  const stopMonitoring = () => {
    try {
      bleContainer.startWorkoutMonitoring.stop();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unknown error");
    } finally {
      setIsMonitoring(false);
      setIsTimerRunning(false);
    }
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
    error,
    connectToDevice,
    disconnectFromDevice,
    startMonitoring,
    stopMonitoring,
  };
};
