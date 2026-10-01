import {
  WorkoutSessionErrorCode,
  isWorkoutSessionError,
} from "./WorkoutSessionErrorCode";

const MESSAGES: Record<WorkoutSessionErrorCode, string> = {
  SAVE_FAILED:
    "Data lari gagal disimpan di perangkat. Periksa ruang penyimpanan lalu coba lagi.",
  DELETE_FAILED: "Data sementara gagal dihapus dari perangkat.",
  UPLOAD_FAILED: "Data lari gagal dikirim ke server. Akan dicoba lagi nanti.",
};

export const toUserMessage = (error: unknown): string =>
  isWorkoutSessionError(error)
    ? MESSAGES[error.code]
    : "Terjadi kesalahan tak terduga. Coba lagi.";
