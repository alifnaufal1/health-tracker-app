import { WebResponse } from "../../dto/WebResponse";
import { WorkoutDetailResponse, WorkoutResponse } from "../../dto/WorkoutDto";
import { apiClient } from "./apiClient";

export const fetchByDeviceId = async (
  deviceId: string,
): Promise<WorkoutResponse[]> => {
  const res = await apiClient.get<WebResponse<WorkoutResponse[]>>(
    `/devices/${deviceId}/workout-data`,
  );
  if (__DEV__) {
    console.debug("[WorkoutDataApi] fetched count:", res.data.data.length);
  }
  return res.data.data;
};

export const fetchById = async (id: string): Promise<WorkoutDetailResponse> => {
  const res = await apiClient.get<WebResponse<WorkoutDetailResponse>>(
    `/workout-data/${id}`,
  );
  if (__DEV__) {
    console.debug("[WorkoutDataApi] message:", res.data.message);
  }
  return res.data.data;
};
