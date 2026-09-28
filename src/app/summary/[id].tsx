import { Stack } from "expo-router";
import WorkoutSummaryScreen from "../../presentation/screens/WorkoutSummaryScreen";

export default function SummaryRoute() {
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <WorkoutSummaryScreen />
    </>
  );
}
