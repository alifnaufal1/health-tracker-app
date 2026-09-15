import { apiClient } from "./apiClient";

export const loginRequest = async (email: string, password: string) => {
  const response = await apiClient.post("/auth/login", { email, password });
  return response.data;
};

export const registerRequest = async (
  name: string,
  nick_name: string,
  password: string,
) => {
  const response = await apiClient.post("/user", {
    name,
    nick_name,
    password,
  });
  console.info("response: ", response);
  return response.data.data;
};

export const getProfileRequest = async (userId: string) => {
  const response = await apiClient.get(`/user/${userId}`);
  return response.data.data;
};
