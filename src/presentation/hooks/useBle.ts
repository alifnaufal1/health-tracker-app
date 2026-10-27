import { WorkoutSample } from "@/domain/entities/WorkoutSample";
import { ConnectResult } from "@/domain/usecases/ConnectToDevice";
import { useEffect, useRef, useState } from "react";
import { BleDevice } from "../../domain/entities/BleDevice";
import { bleContainer } from "../di/bleContainer";
import {
  CONNECT_FAILURE_MESSAGES,
  UNEXPECTED_MESSAGE,
} from "../errors/connectMessages";

export function useBle() {
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

  // useEffect(() => {
  //   if (isTimerRunning) {
  //     timerRef.current = setInterval(() => {
  //       setTime((prevTime) => prevTime + 1);
  //     }, 1000);
  //   } else {
  //     clearInterval(timerRef.current);
  //   }

  //   return () => clearInterval(timerRef.current);
  // }, [isTimerRunning]);

  const connectToDevice = async (): Promise<ConnectResult | null> => {
    setIsConnecting(true);
    setError(null);
    try {
      const result = await bleContainer.connectToDevice.execute();

      if (result.status === "connected") {
        setActiveDevice(result.connectedDevice);
        setIsConnected(true);
      } else {
        setError(CONNECT_FAILURE_MESSAGES[result.status]);
      }
      return result;
    } catch (error) {
      console.error("useBle.connectToDevice unexpected", error);
      setError(UNEXPECTED_MESSAGE);
      return null;
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
}
