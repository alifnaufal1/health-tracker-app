import { Heart } from "lucide-react-native";
import { StyleSheet, Text, View } from "react-native";
import { ZoneBars } from "./Zonebars";

type HeartRateCardProps = {
  bpm: number;
  zoneLabel: string; // e.g. "Zone 3 - Cardio"
  activeBars: number;
  currentBarIndex: number;
};

export function HeartRateCard({
  bpm,
  zoneLabel,
  activeBars,
  currentBarIndex,
}: HeartRateCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <View style={styles.headerLeft}>
          <Heart size={16} color="#22c55e" fill="#22c55e" />
          <Text style={styles.headerLabel}>HEART RATE</Text>
        </View>
        <View style={styles.zonePill}>
          <Text style={styles.zonePillText}>{zoneLabel}</Text>
        </View>
      </View>

      <View style={styles.bpmRow}>
        <Text style={styles.bpmValue}>{bpm}</Text>
        <Text style={styles.bpmUnit}>BPM</Text>
      </View>

      <ZoneBars activeBars={activeBars} currentBarIndex={currentBarIndex} />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#0f0f0f",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
    padding: 18,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  headerLabel: {
    color: "#999",
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  zonePill: {
    backgroundColor: "rgba(34,197,94,0.12)",
    borderWidth: 1,
    borderColor: "rgba(34,197,94,0.4)",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  zonePillText: {
    color: "#22c55e",
    fontSize: 12,
    fontWeight: "700",
  },
  bpmRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    marginTop: 8,
    gap: 8,
  },
  bpmValue: {
    color: "#22c55e",
    fontSize: 64,
    fontWeight: "800",
    lineHeight: 64,
  },
  bpmUnit: {
    color: "#777",
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
  },
});
