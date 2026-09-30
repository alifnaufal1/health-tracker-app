import { WorkoutSession } from "@/domain/entities/WorkoutSample";
import { isWorkoutSessionError } from "@/domain/errors/WorkoutSessionErrorCode";
import { useEffect, useRef, useState } from "react";
import "react-native-get-random-values";
import { v4 as uuidv4 } from "uuid";
import { WorkoutSessionContainer } from "../di/workoutSessionContainer";
import { useBle } from "./useBle";

const toUserMessage = (error: unknown): string => {
  if (isWorkoutSessionError(error, "SAVE_FAILED"))
    return "Data lari gagal disimpan di perangkat. Periksa ruang penyimpanan lalu coba lagi.";
  return "Terjadi kesalahan tak terduga. Coba lagi.";
};

type BleState = Pick<
  ReturnType<typeof useBle>,
  | "runningData"
  | "heartRate"
  | "activeDevice"
  | "startMonitoring"
  | "stopMonitoring"
>;

export function useWorkoutSession(ble: BleState) {
  const {
    runningData,
    heartRate,
    activeDevice,
    startMonitoring,
    stopMonitoring,
  } = ble;
  const sessionRef = useRef<WorkoutSession | null>(null);
  const [status, setStatus] = useState<
    "idle" | "recording" | "saving" | "uploaded" | "pending_upload" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!sessionRef.current || !runningData) return;
    const session = sessionRef.current;

    const record = async () => {
      try {
        await WorkoutSessionContainer.record.execute(session, {
          timestamp: Date.now(),
          steps: runningData.steps,
          distance: runningData.distance,
          calories: runningData.calories,
          heartRate,
        });
      } catch (error) {
        console.error("useWorkoutSession.record unexpected", error);
      }
    };

    record();
  }, [runningData, heartRate]);

  const start = () => {
    if (!activeDevice) return;
    sessionRef.current = {
      id: uuidv4(),
      deviceId: activeDevice.id,
      startedAt: Date.now(),
      samples: [],
      status: "recording",
    };
    setStatus("recording");
    setErrorMessage(null);
    startMonitoring();
  };

  const stop = async () => {
    stopMonitoring();
    const session = sessionRef.current;
    if (!session) return;

    setStatus("saving");
    try {
      const result = await WorkoutSessionContainer.finish.execute(session);
      sessionRef.current = null;
      setStatus(result);
    } catch (error) {
      if (!isWorkoutSessionError(error)) {
        console.error("useWorkoutSession.stop unexpected", { error });
      }
      setErrorMessage(toUserMessage(error));
      setStatus("error");
    }
  };

  return { status, errorMessage, start, stop };
}
