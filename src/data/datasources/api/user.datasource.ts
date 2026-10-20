import { LoginUserResponse, RegisterUserResponse } from "@/data/dto/UserDto";
import { WebResponse } from "@/data/dto/WebResponse";
import { RegisterInput } from "@/domain/entities/RegisterInput";
import { apiClient } from "./apiClient";

export const loginRequest = async (username: string, password: string) => {
  const res = await apiClient.post<WebResponse<LoginUserResponse>>(
    "/auth/login",
    {
      username,
      password,
    },
  );
  if (__DEV__) {
    console.debug("[UserApi] data:", res.data.data);
  }
  return res.data.data;
};

export const registerRequest = async (input: RegisterInput) => {
  const res = await apiClient.post<WebResponse<RegisterUserResponse>>(
    "/auth/register",
    {
      name: input.name,
      username: input.username,
      password: input.password,
    },
  );
  if (__DEV__) {
    console.debug("[UserApi] data:", res.data.data);
  }
  return res.data.data;
};

export const getProfileRequest = async () => {
  const response = await apiClient.get("/user/me");
  console.info("get profile request response: ", response.data.data);
  return response.data.data;
};
