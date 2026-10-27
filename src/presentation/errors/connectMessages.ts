import { ConnectResult } from "@/domain/usecases/ConnectToDevice";

type FailureStatus = Exclude<ConnectResult["status"], "connected">;

export const CONNECT_FAILURE_MESSAGES: Record<FailureStatus, string> = {
  rejected:
    "Bluetooth permission is needed to find your smartwatch. Please allow it and try again.",
  blocked:
    "Bluetooth permission is blocked. Enable it in the app settings to continue.",
  bluetooth_off: "Bluetooth is off. Turn it on and try again.",
  not_found:
    "Smartwatch not found. Move your phone closer to the watch and try again.",
  fail: "Couldn't connect to the smartwatch. Please try again.",
};

export const UNEXPECTED_MESSAGE = "Something went wrong. Please try again.";
