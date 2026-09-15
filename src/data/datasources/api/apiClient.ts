import axios, { AxiosInstance } from "axios";
import { env } from "../../../config/env";

let authToken: string | null = null;

export const setAuthToken = (token: string | null) => {
  authToken = token;
};

export const apiClient: AxiosInstance = axios.create({
  baseURL: env.apiBaseUrl,
  timeout: env.apiTimeoutMs,
});

apiClient.interceptors.request.use((config) => {
  if (authToken) {
    config.headers.Authorization = `Bearer ${authToken}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message ?? error.message ?? "Unknown API error";
    return Promise.reject(new Error(message));
  },
);
