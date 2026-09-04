import React from "react";
import { StyleSheet, Text, View } from "react-native";
import type { LucideIcon } from "lucide-react-native";

type StatCardProps = {
  label: string;
  value: string;
  unit?: string;
  icon?: LucideIcon;
  /**
   * "large"   -> icon + label on top, big value, unit below (e.g. Pace, Distance)
   * "compact" -> label on left, value + unit inline on the right (e.g. Calories, Cadence)
   */
  variant?: "large" | "compact";
};

export function StatCard({
  label,
  value,
  unit,
  icon: Icon,
  variant = "large",
}: StatCardProps) {
  if (variant === "compact") {
    return (
      <View style={[styles.card, styles.compactCard]}>
        <Text style={styles.compactLabel}>{label}</Text>
        <View style={styles.compactValueRow}>
          <Text style={styles.compactValue}>{value}</Text>
          {unit ? <Text style={styles.compactUnit}> {unit}</Text> : null}
        </View>
      </View>
    );
  }

  return (
    <View style={styles.card}>
      <View style={styles.largeHeader}>
        {Icon ? <Icon size={14} color="#999" /> : null}
        <Text style={styles.label}>{label}</Text>
      </View>
      <Text style={styles.value}>{value}</Text>
      {unit ? <Text style={styles.unit}>{unit}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: "#0f0f0f",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  largeHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 8,
  },
  label: {
    color: "#999",
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  value: {
    color: "#fff",
    fontSize: 26,
    fontWeight: "800",
  },
  unit: {
    color: "#777",
    fontSize: 12,
    marginTop: 2,
  },
  compactCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
  },
  compactLabel: {
    color: "#999",
    fontSize: 13,
    fontWeight: "500",
  },
  compactValueRow: {
    flexDirection: "row",
    alignItems: "baseline",
  },
  compactValue: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },
  compactUnit: {
    color: "#777",
    fontSize: 12,
  },
});
