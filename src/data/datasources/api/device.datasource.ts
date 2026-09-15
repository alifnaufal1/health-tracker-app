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
  console.info("register device response:", response.data.data);
  return response.data.data;
};

export const getDeviceRequestById = async (deviceId: string) => {
  const response = await apiClient.get(`/device${deviceId}`);
  console.info("get device by id response:", response.data.data);
  return response.data.data;
};
