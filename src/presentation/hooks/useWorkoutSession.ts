import { WorkoutSession } from "@/domain/entities/WorkoutSample";
import { isWorkoutSessionError } from "@/domain/errors/WorkoutSessionErrorCode";
import { toUserMessage } from "@/domain/errors/workoutSessionMessages";
import { useEffect, useRef, useState } from "react";
import "react-native-get-random-values";
import { v4 as uuidv4 } from "uuid";
import { WorkoutSessionContainer } from "../di/workoutSessionContainer";
import { useBle } from "./useBle";

type BleState = Pick<
  ReturnType<typeof useBle>,
  | "runningData"
  | "heartRate"
  | "activeDevice"
  | "startMonitoring"
  | "stopMonitoring"
>;

type SessionStatus =
  | "idle"
  | "recording"
  | "saving"
  | "uploaded"
  | "pending_upload"
  | "discarded"
  | "error";

export function useWorkoutSession(ble: BleState) {
  const {
    runningData,
    heartRate,
    activeDevice,
    startMonitoring,
    stopMonitoring,
  } = ble;
  const sessionRef = useRef<WorkoutSession | null>(null);
  const [status, setStatus] = useState<SessionStatus>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);

  useEffect(() => {
    const session = sessionRef.current;
    if (!session || !runningData) return;

    WorkoutSessionContainer.record
      .execute(session, {
        timestamp: Date.now(),
        steps: runningData.steps,
        distance: runningData.distance,
        calories: runningData.calories,
        heartRate,
      })
      .catch((error) => {
        console.error("useWorkoutSession.record unexpected", error);
      });
  }, [runningData, heartRate]);

  const start = async () => {
    if (!activeDevice) {
      setErrorMessage("Smartwatch belum terhubung.");
      return;
    }
    setErrorMessage(null);
    setInfoMessage(null);

    sessionRef.current = {
      id: uuidv4(),
      deviceId: activeDevice.id,
      startedAt: Date.now(),
      samples: [],
      status: "recording",
    };

    const started = await startMonitoring();
    if (!started) {
      sessionRef.current = null;
      return;
    }
    setStatus("recording");
  };

  const stop = async () => {
    const session = sessionRef.current;
    sessionRef.current = null;
    stopMonitoring();
    if (!session) return;

    setStatus("saving");
    setErrorMessage(null);
    setInfoMessage(null);

    try {
      const result = await WorkoutSessionContainer.finish.execute(session);
      if (result === "discarded_too_short") {
        setStatus("discarded");
        setInfoMessage("Data tidak disimpan karena lari terlalu singkat.");
      } else if (result === "pending_upload") {
        setStatus("pending_upload");
        setInfoMessage(
          "Data tersimpan di perangkat dan akan dikirim ulang nanti.",
        );
      } else {
        setStatus("uploaded");
      }
    } catch (error) {
      sessionRef.current = session;
      if (!isWorkoutSessionError(error)) {
        console.error("useWorkoutSession.stop unexpected", error);
      }
      setErrorMessage(toUserMessage(error));
      setStatus("error");
    }
  };

  return { status, errorMessage, infoMessage, start, stop };
}
