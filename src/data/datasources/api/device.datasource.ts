import { apiClient } from "./apiClient";

export const registerDeviceRequest = async (
  deviceId: string,
  deviceName: string,
  manufacturerName: string,
  localName: string,
  userId: string,
) => {
  const response = await apiClient.post("/device", {
    device_id: deviceId,
    device_name: deviceName,
    manufacturer_name: manufacturerName,
    local_name: localName,
    user_id: userId,
  });
  return response.data;
};
