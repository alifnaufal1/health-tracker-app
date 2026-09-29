import { PaceSplit } from "@/data/datasources/workout";
import { BarChart2, Star } from "lucide-react-native";
import { StyleSheet, Text, View } from "react-native";

type PaceSplitsCardProps = {
  splits: PaceSplit[];
};

const TYPE_COLOR: Record<PaceSplit["type"], string> = {
  warmup: "#3b82f6",
  fastest: "#22c55e",
  cooldown: "#f97316",
  normal: "#555",
};

export function PaceSplitsCard({ splits }: PaceSplitsCardProps) {
  const hasHighlighted = splits.some((s) => s.type !== "normal");

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <BarChart2 size={14} color="#999" />
        <Text style={styles.headerLabel}>PACE PER KILOMETER · SPLITS</Text>
      </View>

      <View style={styles.tableHeaderRow}>
        <Text style={[styles.tableHeaderText, styles.kmCol]}>KM</Text>
        <Text style={[styles.tableHeaderText, styles.barCol]}>PACE BAR</Text>
        <Text style={[styles.tableHeaderText, styles.paceCol]}>PACE</Text>
        <Text style={[styles.tableHeaderText, styles.bpmCol]}>AVG BPM</Text>
      </View>

      {splits.map((split) => (
        <View key={split.km} style={styles.splitRow}>
          <Text style={[styles.kmText, styles.kmCol]}>{split.km}</Text>
          <View style={[styles.barTrack, styles.barCol]}>
            <View
              style={[
                styles.barFill,
                {
                  width: `${split.barWidthPercent}%`,
                  backgroundColor: TYPE_COLOR[split.type],
                },
              ]}
            />
          </View>
          <View style={[styles.paceCol, styles.paceValueRow]}>
            <Text style={styles.paceText}>{split.pace}</Text>
            {split.type !== "normal" && (
              <Star
                size={11}
                color={TYPE_COLOR[split.type]}
                fill={TYPE_COLOR[split.type]}
              />
            )}
          </View>
          <Text style={[styles.bpmText, styles.bpmCol]}>
            {split.avgBpm} bpm
          </Text>
        </View>
      ))}

      {hasHighlighted && (
        <View style={styles.legendRow}>
          <LegendDot color={TYPE_COLOR.warmup} label="Warm up" />
          <LegendDot color={TYPE_COLOR.fastest} label="Fastest" />
          <LegendDot color={TYPE_COLOR.cooldown} label="Cool down" />
        </View>
      )}
    </View>
  );
}

function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <View style={styles.legendItem}>
      <View style={[styles.legendDot, { backgroundColor: color }]} />
      <Text style={styles.legendLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#0f0f0f",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
    padding: 16,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 12,
  },
  headerLabel: {
    color: "#999",
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  tableHeaderRow: { flexDirection: "row", marginBottom: 8 },
  tableHeaderText: { color: "#666", fontSize: 9, fontWeight: "700" },
  kmCol: { width: 28 },
  barCol: { flex: 1, marginHorizontal: 8 },
  paceCol: { width: 56 },
  bpmCol: { width: 56, textAlign: "right" },
  splitRow: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
  kmText: { color: "#ccc", fontSize: 12, fontWeight: "600" },
  barTrack: {
    height: 6,
    borderRadius: 3,
    backgroundColor: "rgba(255,255,255,0.06)",
  },
  barFill: { height: 6, borderRadius: 3 },
  paceValueRow: { flexDirection: "row", alignItems: "center", gap: 3 },
  paceText: { color: "#fff", fontSize: 12, fontWeight: "700" },
  bpmText: { color: "#888", fontSize: 11, textAlign: "right" },
  legendRow: { flexDirection: "row", gap: 14, marginTop: 4 },
  legendItem: { flexDirection: "row", alignItems: "center", gap: 5 },
  legendDot: { width: 7, height: 7, borderRadius: 3.5 },
  legendLabel: { color: "#777", fontSize: 10 },
});
