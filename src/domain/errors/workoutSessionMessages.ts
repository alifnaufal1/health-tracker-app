import { genericToUserMessage } from "./general";
import {
  isWorkoutSessionError,
  WorkoutSessionErrorCode,
} from "./WorkoutSessionErrorCode";

const MESSAGES: Record<WorkoutSessionErrorCode, string> = {
  SAVE_FAILED:
    "The run data could not be saved to the device. Check your storage space and try again.",
  DELETE_FAILED: "Temporary data failed to be deleted from the device.",
  UPLOAD_FAILED:
    "Run data failed to send to the server. It will be retried later.",
};

export const toUserMessage = (error: unknown): string =>
  genericToUserMessage(isWorkoutSessionError, MESSAGES, error);
