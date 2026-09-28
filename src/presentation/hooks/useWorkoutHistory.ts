import { Workout } from "@/domain/entities/Workout";
import { useEffect, useState } from "react";
import { Alert } from "react-native";
import { WorkoutContainer } from "../di/workoutContainer";

export const useWorkoutHistory = (deviceId?: string) => {
  const [data, setData] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.info("deviceId: ", deviceId);

    const fetchAll = async () => {
      try {
        if (deviceId) {
          const data =
            await WorkoutContainer.getWorkoutHistory.execute(deviceId);
          setData(data);
        }
      } catch (error: any) {
        Alert.alert(
          "Failed to fetch all workout history",
          (error as Error).message,
        );
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, [deviceId]);

  return { data, loading };
};
