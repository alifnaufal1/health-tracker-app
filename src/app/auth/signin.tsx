import AuthScreen from "@/presentation/screens/AuthScreen";
import { Stack, useRouter } from "expo-router";

export default function SignInRoute() {
  const router = useRouter();

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <AuthScreen
        mode="signIn"
        onBack={() => router.back()}
        onSwitch={() => {}}
      />
    </>
  );
}
