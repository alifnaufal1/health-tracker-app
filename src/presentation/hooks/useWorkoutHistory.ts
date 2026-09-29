import { Workout } from "@/domain/entities/Workout";
import { useCallback, useEffect, useState } from "react";
import { WorkoutContainer } from "../di/workoutContainer";

export const useWorkoutHistory = (deviceId?: string) => {
  const [data, setData] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWorkoutHistory = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      if (deviceId) {
        const data = await WorkoutContainer.getWorkoutHistory.execute(deviceId);
        setData(data);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, [deviceId]);

  useEffect(() => {
    fetchWorkoutHistory();
  }, [fetchWorkoutHistory]);

  return { data, loading, error, refetch: fetchWorkoutHistory };
};
