import AsyncStorage from "@react-native-async-storage/async-storage";

const USER_KEY = "user";

export const saveUserRaw = async (userRaw: string): Promise<void> =>
  await AsyncStorage.setItem(USER_KEY, userRaw);

export const getUserRaw = async (): Promise<string | null> =>
  AsyncStorage.getItem(USER_KEY);

export const removeUser = async (): Promise<void> => {
  await AsyncStorage.removeItem(USER_KEY);
};
