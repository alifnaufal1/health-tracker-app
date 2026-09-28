import { WebResponse } from "../../dto/WebResponse";
import { WorkoutResponse } from "../../dto/WorkoutDto";
import { apiClient } from "./apiClient";

export const fetchByDeviceId = async (
  deviceId: string,
): Promise<WorkoutResponse[]> => {
  const res = await apiClient.get<WebResponse<WorkoutResponse[]>>(
    `/devices/${deviceId}/workout-data`,
  );
  console.info(res.data.data);
  if (__DEV__) {
    console.debug("[WorkoutDataApi] fetched count:", res.data.data.length);
  }
  return res.data.data;
};
