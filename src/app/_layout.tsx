import {
  restoreAuthOnce,
  wireUnauthorizedHandler,
} from "@/presentation/auth/bootstrapAuth";
import { useAuthStore } from "@/presentation/stores/authStore";
import { SplashScreen, Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const status = useAuthStore((s) => s.auth.status);

  useEffect(() => {
    wireUnauthorizedHandler();
    restoreAuthOnce();
  }, []);

  useEffect(() => {
    if (status !== "checking") SplashScreen.hideAsync();
  }, [status]);

  if (status === "checking") return null;

  const isSignedIn = status === "signed_in";

  return (
    <>
      <StatusBar style="light" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Protected guard={true}>
          {/* <Stack.Screen name="index" /> */}
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="auth/signin" />
          <Stack.Screen name="auth/signup" />
        </Stack.Protected>
      </Stack>
    </>
  );
}
