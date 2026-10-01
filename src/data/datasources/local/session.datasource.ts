import AsyncStorage from "@react-native-async-storage/async-storage";

const keyOf = (id: string) => `workout_session:${id}`;

export const saveWorkoutSession = async (
  id: string,
  raw: string,
): Promise<void> => {
  await AsyncStorage.setItem(keyOf(id), raw);
};

export const removeWorkoutSession = async (id: string): Promise<void> => {
  await AsyncStorage.removeItem(keyOf(id));
};
