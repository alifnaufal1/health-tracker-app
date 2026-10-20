import axios from "axios";

export type HttpErrorInfo = {
  status?: number;
  code?: string;
  message?: string;
};

export const toHttpErrorInfo = (error: unknown): HttpErrorInfo => {
  if (axios.isAxiosError(error)) {
    return {
      status: error.response?.status,
      code: error.code,
      message: error.message,
    };
  }
  return { message: error instanceof Error ? error.message : String(error) };
};
