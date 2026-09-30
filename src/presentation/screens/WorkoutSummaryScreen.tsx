import { useLocalSearchParams, useRouter } from "expo-router";
import { Gauge, MapPin, Timer } from "lucide-react-native";
import { useMemo } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { HeartRateChart } from "../components/HeartRateChart";
import { PaceSplitsCard } from "../components/PaceSplitsCard";
import { StatCard } from "../components/StatCard";
import { SummaryHeader } from "../components/SummaryHeader";
import { useWorkoutDetail } from "../hooks/useWorkoutDetail";
import {
  formatDate,
  formatDistanceKm,
  formatDurationFlexible,
  formatPace,
  formatTime12Hour,
} from "../utils/formatters";
import { toPaceSplitViewModels } from "../viewmodels/paceSplitViewModel";

export default function WorkoutSummaryScreen() {
  const { id, from } = useLocalSearchParams<{ id: string; from?: string }>();
  const { data, error, loading } = useWorkoutDetail(id);
  console.info("~~~WorkoutSummaryScreen.id:", id);
  const router = useRouter();

  const splitViewModels = useMemo(
    () => (data?.paceSplits ? toPaceSplitViewModels(data.paceSplits) : []),
    [data?.paceSplits],
  );

  const isFromHistory = from === "history";

  if (!data) return;

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content}>
        <SummaryHeader
          variant={isFromHistory ? "detail" : "completed"}
          dateTimeLabel={`${formatDate(data.startedAt)}, ${formatTime12Hour(data.startedAt)}`}
          onBackPress={() => router.back()}
        />

        <View style={styles.row}>
          <StatCard
            label="DISTANCE"
            value={`${formatDistanceKm(data.distanceMeters)}`}
            unit="km"
            icon={MapPin}
          />
          <StatCard
            label="DURATION"
            value={formatDurationFlexible(data.durationSeconds)}
            unit="min"
            icon={Timer}
          />
          <StatCard
            label="AVG PACE"
            value={formatPace(data.avgPaceSecPerKm)}
            unit="/km"
            icon={Gauge}
          />
        </View>

        <View style={styles.row}>
          <StatCard
            label="TOTAL STEPS"
            value={data.steps.toLocaleString("en-US")}
            unit="steps"
          />
          <StatCard label="CALORIES" value={`${data.calories}`} unit="kcal" />
        </View>

        {data.heartRateSeries ? (
          <HeartRateChart
            series={data.heartRateSeries}
            avgBpm={data.avgHeartRate}
            maxBpm={data.maxHeartRate}
          />
        ) : null}

        <PaceSplitsCard splitsViewModel={splitViewModels} />
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
