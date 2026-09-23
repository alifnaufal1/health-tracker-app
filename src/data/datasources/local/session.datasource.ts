import AsyncStorage from "@react-native-async-storage/async-storage";

const USER_ID_KEY = "@auth/userId";
const SESSION_KEY = "@auth/session";

export const clearSession = async (): Promise<void> => {
  await AsyncStorage.removeItem(SESSION_KEY);
};

export const clearUserId = async (): Promise<void> => {
  await AsyncStorage.removeItem(USER_ID_KEY);
};
