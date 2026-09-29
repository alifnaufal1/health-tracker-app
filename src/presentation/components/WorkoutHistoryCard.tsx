import { Workout } from "@/domain/entities/Workout";
import { ChevronRight } from "lucide-react-native";
import { Pressable, StyleSheet, Text, View } from "react-native";
import {
  formatDate,
  formatDurationFromSeconds,
  formatPace,
  formatTime12Hour,
} from "../utils/formatters";

type WorkoutHistoryCardProps = {
  workout: Workout;
  onPress: () => void;
};

export function WorkoutHistoryCard({
  workout,
  onPress,
}: WorkoutHistoryCardProps) {
  return (
    <Pressable onPress={onPress} style={styles.card}>
      <View style={styles.topRow}>
        <View>
          <Text style={styles.date}>{formatDate(workout.startedAt)}</Text>
          <Text style={styles.time}>{formatTime12Hour(workout.startedAt)}</Text>
        </View>
        <View style={styles.durationBlock}>
          <Text style={styles.durationLabel}>DURATION</Text>
          <Text style={styles.durationValue}>
            {formatDurationFromSeconds(workout.durationSeconds)}
          </Text>
        </View>
        <ChevronRight size={18} color="#555" />
      </View>

      <View style={styles.metricsRow}>
        <Metric
          label="DISTANCE"
          value={`${workout.distanceMeters}`}
          unit="km"
        />
        <Metric
          label="AVG PACE"
          value={formatPace(workout.avgPaceSecPerKm)}
          unit="/km"
        />
        <Metric label="AVG HR" value={`${workout.avgHeartRate}`} unit="bpm" />
      </View>

      <View style={[styles.metricsRow, { paddingBottom: 16 }]}>
        <Metric label="STEPS" value={workout.steps.toLocaleString("en-US")} />
        <Metric label="CALORIES" value={`${workout.calories}`} unit="kcal" />
        <Text style={styles.viewRun}>VIEW RUN</Text>
      </View>
    </Pressable>
  );
}

function Metric({
  label,
  value,
  unit,
}: {
  label: string;
  value: string;
  unit?: string;
}) {
  return (
    <View style={styles.metric}>
      <Text style={styles.metricLabel}>{label}</Text>
      <Text style={styles.metricValue}>
        {value}
        {unit ? <Text style={styles.metricUnit}> {unit}</Text> : null}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#111111",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
    gap: 14,
  },
  topRow: {
    borderTopRightRadius: 18,
    borderTopLeftRadius: 18,
    padding: 16,
    borderLeftWidth: 3,
    borderLeftColor: "#22c55e",
    borderColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  date: { color: "#fff", fontSize: 15, fontWeight: "700" },
  time: { color: "#777", fontSize: 12, marginTop: 2 },
  durationBlock: { alignItems: "flex-end", marginRight: 8 },
  durationLabel: { color: "#777", fontSize: 10, fontWeight: "700" },
  durationValue: {
    color: "#22c55e",
    fontSize: 15,
    fontWeight: "700",
    marginTop: 2,
  },
  metricsRow: {
    paddingHorizontal: 16,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  metric: { flex: 1 },
  metricLabel: {
    color: "#777",
    fontSize: 10,
    fontWeight: "700",
    marginBottom: 4,
  },
  metricValue: { color: "#fff", fontSize: 15, fontWeight: "700" },
  metricUnit: { color: "#777", fontSize: 11, fontWeight: "400" },
  viewRun: {
    color: "#22c55e",
    fontSize: 11,
    fontWeight: "700",
    alignSelf: "flex-end",
  },
});
