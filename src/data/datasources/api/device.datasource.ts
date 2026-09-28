import { apiClient } from "./apiClient";

export const registerDeviceRequest = async (
  deviceId: string,
  deviceName: string,
  manufacturerName: string,
  localName: string,
) => {
  const response = await apiClient.post("/devices", {
    device_id: deviceId,
    device_name: deviceName,
    manufacturer_name: manufacturerName,
    local_name: localName,
  });
  console.info("register device response:", response.data.data);
  return response.data.data;
};

export const getUserDeviceRequest = async () => {
  const response = await apiClient.get("/devices/me");
  console.info("get login user device response:", response.data.data);
  return response.data.data;
};
