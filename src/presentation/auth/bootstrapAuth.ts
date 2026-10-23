import { setUnauthorizedHandler } from "@/data/datasources/api/apiClient";
import { Alert } from "react-native";
import { authContainer } from "../di/authContainer";
import { useAuthStore } from "../stores/authStore";

let started = false;

export async function restoreAuthOnce(): Promise<void> {
  if (started) return;
  started = true;

  try {
    const result = await authContainer.restoreSession.execute();
    useAuthStore.getState().sessionRestored(result);
  } catch (error) {
    console.error("restoreAuthOnce unexpected", error);
    useAuthStore.getState().sessionRestored({ status: "signed_out" });
  }
}

export function wireUnauthorizedHandler(): void {
  setUnauthorizedHandler(() => {
    const changed = useAuthStore.getState().signedOut();
    if (!changed) return;

    authContainer.markSessionInvalid
      .execute()
      .catch((error) => console.error("markSessionInvalid unexpected", error));

    Alert.alert(
      "Session expired",
      "Your session has expired. Please sign in again.",
    );
  });
}
