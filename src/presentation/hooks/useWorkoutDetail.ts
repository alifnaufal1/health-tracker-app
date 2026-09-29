import { Workout } from "@/domain/entities/Workout";
import { useEffect, useState } from "react";
import { WorkoutContainer } from "../di/workoutContainer";

export const useWorkoutDetail = (workoutId?: string) => {
  const [data, setData] = useState<Workout | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        if (workoutId) {
          const data =
            await WorkoutContainer.getWorkoutDetail.execute(workoutId);
          setData(data);
        }
      } catch (e) {
        setError(e instanceof Error ? e.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [workoutId]);

  return { data, loading, error };
};
