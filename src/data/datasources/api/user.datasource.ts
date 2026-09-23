import { apiClient } from "./apiClient";

export const loginRequest = async (username: string, password: string) => {
  const response = await apiClient.post("/auth/login", {
    username,
    password,
  });
  console.info("login response: ", response.data.data);
  return response.data.data;
};

export const registerRequest = async (
  name: string,
  username: string,
  nickname: string,
  password: string,
) => {
  const response = await apiClient.post("/auth/register", {
    name,
    username,
    nickname,
    password,
  });
  console.info("register user response: ", response.data.data);
  return response.data.data;
};

export const getProfileRequest = async () => {
  const response = await apiClient.get("/user/me");
  console.info("get profile request response: ", response.data.data);
  return response.data.data;
};
