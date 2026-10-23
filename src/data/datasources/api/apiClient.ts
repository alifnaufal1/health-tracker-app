import axios, { AxiosInstance } from "axios";
import { env } from "../../../config/env";

let authToken: string | null = null;

export class ApiError extends Error {
  constructor(
    message: string,
    public status?: number,
  ) {
    super(message);
  }
}

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

let onUnauthorized: (() => void) | null = null;
export const setUnauthorizedHandler = (handler: (() => void) | null) => {
  onUnauthorized = handler;
};

apiClient.interceptors.response.use(
  (res) => res,
  (error) => {
    const isAuthEndpoint = error.config?.url?.startsWith("/auth/");
    if (
      axios.isAxiosError(error) &&
      error.response?.status === 401 &&
      !isAuthEndpoint
    ) {
      onUnauthorized?.();
    } else {
      const message =
        error.response?.data?.message ?? error.message ?? "Unknown API error";
      return Promise.reject(new ApiError(message, error.response?.status));
    }
    // return Promise.reject(error);
  },
);
