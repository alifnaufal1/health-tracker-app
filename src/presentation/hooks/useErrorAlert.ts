import { useEffect } from "react";
import { Alert, AlertButton } from "react-native";

export const useErrorAlert = (error: string | null, onRetry?: () => void) => {
  useEffect(() => {
    if (!error) return;
    const buttons: AlertButton[] = onRetry
      ? [{ text: "Retry", onPress: onRetry }, { text: "OK" }]
      : [{ text: "OK" }];
    Alert.alert("Something went wrong", error, buttons);
  }, [error, onRetry]);
};
