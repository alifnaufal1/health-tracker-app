import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

type HistoryHeaderProps = {
  totalRuns: number;
  loading: boolean;
};

export function HistoryHeader({ totalRuns, loading }: HistoryHeaderProps) {
  return (
    <View style={styles.column}>
      <View style={styles.row}>
        <View>
          <Text style={styles.title}>Workout History</Text>
          <Text style={styles.subtitle}>Every run, all in one place</Text>
        </View>
        <View style={styles.badge}>
          <View style={styles.dot} />
          <Text style={styles.badgeText}>{totalRuns} RUNS</Text>
        </View>
      </View>
      {loading && <ActivityIndicator size="large" color="#22c55e" />}
    </View>
  );
}

const styles = StyleSheet.create({
  column: {
    flexDirection: "column",
    // justifyContent: "space-between",
    // alignItems: "flex-start",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  title: {
    color: "#fff",
    fontSize: 26,
    fontWeight: "800",
  },
  subtitle: {
    color: "#888",
    fontSize: 13,
    marginTop: 4,
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(34,197,94,0.12)",
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#22c55e",
  },
  badgeText: {
    color: "#22c55e",
    fontSize: 11,
    fontWeight: "700",
  },
});
