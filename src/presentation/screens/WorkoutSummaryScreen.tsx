import { WORKOUTS } from "@/data/datasources/workout";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Gauge, MapPin, Timer } from "lucide-react-native";
import { ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { HeartRateChart } from "../components/HeartRateChart";
import { PaceSplitsCard } from "../components/PaceSplitsCard";
import { StatCard } from "../components/StatCard";
import { SummaryHeader } from "../components/SummaryHeader";

export default function WorkoutSummaryScreen() {
  const { id, from } = useLocalSearchParams<{ id: string; from?: string }>();
  const router = useRouter();

  const workout = WORKOUTS.find((w) => w.id === id) ?? WORKOUTS[0];
  const isFromHistory = from === "history";

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content}>
        <SummaryHeader
          variant={isFromHistory ? "detail" : "completed"}
          dateTimeLabel={`${workout.dateLabel}, ${workout.timeLabel}`}
          onBackPress={() => router.back()}
        />

        <View style={styles.row}>
          <StatCard
            label="DISTANCE"
            value={`${workout.distanceKm}`}
            unit="km"
            icon={MapPin}
          />
          <StatCard
            label="DURATION"
            value={workout.durationLabel}
            unit="min"
            icon={Timer}
          />
          <StatCard
            label="AVG PACE"
            value={workout.avgPace}
            unit="/km"
            icon={Gauge}
          />
        </View>

        <View style={styles.row}>
          <StatCard
            label="TOTAL STEPS"
            value={workout.steps.toLocaleString("en-US")}
            unit="steps"
          />
          <StatCard
            label="CALORIES"
            value={`${workout.calories}`}
            unit="kcal"
          />
        </View>

        <HeartRateChart
          series={workout.heartRateSeries}
          avgBpm={workout.avgHr}
          maxBpm={workout.maxHr}
        />

        <PaceSplitsCard splits={workout.splits} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#000" },
  content: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 40,
    gap: 14,
  },
  row: { flexDirection: "row", gap: 12 },
});
