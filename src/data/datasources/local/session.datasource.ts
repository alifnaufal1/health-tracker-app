import { WorkoutSession } from "@/domain/entities/WorkoutSample";
import AsyncStorage from "@react-native-async-storage/async-storage";

const KEY_PREFIX = "workout_session:";
const keyOf = (id: string) => `${KEY_PREFIX}${id}`;

export const saveWorkoutSession = async (
  session: WorkoutSession,
): Promise<void> => {
  await AsyncStorage.setItem(keyOf(session.id), JSON.stringify(session));
};
