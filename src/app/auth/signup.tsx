import AuthScreen from "@/presentation/screens/AuthScreen";
import { Stack, useRouter } from "expo-router";

export default function SignUpRoute() {
  const router = useRouter();

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <AuthScreen
        mode="signUp"
        onBack={() => router.back()}
        onSwitch={() => {}}
      />
    </>
  );
}
