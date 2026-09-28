import React from "react";
import { Heart } from "lucide-react-native";
import { StyleSheet, Text, View } from "react-native";
import Svg, { Defs, LinearGradient, Path, Stop } from "react-native-svg";
import { HeartRatePoint } from "../../../data/workouts";

type HeartRateChartProps = {
  series: HeartRatePoint[];
  avgBpm: number;
  maxBpm: number;
};

const CHART_WIDTH = 300;
const CHART_HEIGHT = 90;

export function HeartRateChart({ series, avgBpm, maxBpm }: HeartRateChartProps) {
  const bpmValues = series.map((p) => p.bpm);
  const minBpm = Math.min(...bpmValues) - 10;
  const maxBpmScale = Math.max(...bpmValues) + 10;

  const points = series.map((p, i) => {
    const x = (i / (series.length - 1)) * CHART_WIDTH;
    const y =
      CHART_HEIGHT - ((p.bpm - minBpm) / (maxBpmScale - minBpm)) * CHART_HEIGHT;
    return { x, y };
  });

  // Buat smooth curve pakai quadratic bezier antar titik tengah
  let path = `M ${points[0].x} ${points[0].y}`;
  for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1];
    const curr = points[i];
    const midX = (prev.x + curr.x) / 2;
    path += ` Q ${prev.x} ${prev.y}, ${midX} ${(prev.y + curr.y) / 2}`;
    path += ` Q ${midX} ${(prev.y + curr.y) / 2}, ${curr.x} ${curr.y}`;
  }

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <View style={styles.headerLeft}>
          <Heart size={14} color="#ef4444" fill="#ef4444" />
          <Text style={styles.headerLabel}>HEART RATE OVER TIME</Text>
        </View>
        <View style={styles.statsRow}>
          <View style={styles.statBlock}>
            <Text style={styles.statLabel}>Avg</Text>
            <Text style={styles.statValue}>{avgBpm}</Text>
          </View>
          <View style={styles.statBlock}>
            <Text style={styles.statLabel}>Max</Text>
            <Text style={styles.statValue}>{maxBpm}</Text>
          </View>
        </View>
      </View>

      <Svg width="100%" height={CHART_HEIGHT} viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`}>
        <Defs>
          <LinearGradient id="hrGradient" x1="0" y1="0" x2="1" y2="0">
            <Stop offset="0" stopColor="#3b82f6" />
            <Stop offset="0.5" stopColor="#22c55e" />
            <Stop offset="1" stopColor="#ef4444" />
          </LinearGradient>
        </Defs>
        <Path d={path} stroke="url(#hrGradient)" strokeWidth={2.5} fill="none" />
      </Svg>

      <View style={styles.xAxisRow}>
        {series.map((p, i) => (
          <Text key={i} style={styles.xAxisLabel}>
            {p.minuteLabel}
          </Text>
        ))}
      </View>
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
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  headerLeft: { flexDirection: "row", alignItems: "center", gap: 6 },
  headerLabel: { color: "#999", fontSize: 11, fontWeight: "700", letterSpacing: 0.5 },
  statsRow: { flexDirection: "row", gap: 14 },
  statBlock: { alignItems: "flex-end" },
  statLabel: { color: "#777", fontSize: 10 },
  statValue: { color: "#ef4444", fontSize: 14, fontWeight: "700" },
  xAxisRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 4,
  },
  xAxisLabel: { color: "#666", fontSize: 9 },
});
