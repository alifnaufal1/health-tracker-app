import { User } from "@/domain/entities/User";
import AsyncStorage from "@react-native-async-storage/async-storage";

const USER_ID_KEY = "@auth/userId";
const DEVICE_ID_KEY = "@auth/deviceId";
const SESSION_KEY = "@auth/session";

type StoredSession = {
  user: User;
  token: string;
};

export const saveSession = async (user: User, token: string): Promise<void> => {
  const payload: StoredSession = { user, token };
  console.info("~~~[DATASOURCE] saveSession().payload:", payload);

  await AsyncStorage.setItem(SESSION_KEY, JSON.stringify(payload));
};

export const getSession = async (): Promise<StoredSession | null> => {
  const raw = await AsyncStorage.getItem(SESSION_KEY);
  console.info("~~~[DATASOURCE] getSession().raw:", raw);

  return raw ? JSON.parse(raw) : null;
};

export const clearSession = async (): Promise<void> => {
  await AsyncStorage.removeItem(SESSION_KEY);
};

export const clearUserId = async (): Promise<void> => {
  await AsyncStorage.removeItem(USER_ID_KEY);
};

export const saveDeviceId = async (deviceId: string): Promise<void> => {
  await AsyncStorage.setItem(DEVICE_ID_KEY, deviceId);
};

export const getDeviceId = async (): Promise<string | null> => {
  return AsyncStorage.getItem(DEVICE_ID_KEY);
};

export const clearDeviceId = async (): Promise<void> => {
  await AsyncStorage.removeItem(DEVICE_ID_KEY);
};
