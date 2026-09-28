import React from "react";
import { ArrowLeft, Check } from "lucide-react-native";
import { Pressable, StyleSheet, Text, View } from "react-native";

type SummaryHeaderProps = {
  variant: "completed" | "detail";
  dateTimeLabel: string;
  onBackPress?: () => void;
};

export function SummaryHeader({ variant, dateTimeLabel, onBackPress }: SummaryHeaderProps) {
  if (variant === "detail") {
    return (
      <View style={styles.row}>
        <Pressable onPress={onBackPress} style={styles.backButton}>
          <ArrowLeft size={20} color="#fff" />
        </Pressable>
        <View>
          <Text style={styles.title}>Workout Detail</Text>
          <Text style={styles.subtitle}>{dateTimeLabel}</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.row}>
      <View style={styles.checkCircle}>
        <Check size={18} color="#22c55e" />
      </View>
      <View>
        <Text style={styles.title}>Workout Completed</Text>
        <Text style={styles.subtitle}>{dateTimeLabel}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  checkCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "rgba(34,197,94,0.15)",
    alignItems: "center",
    justifyContent: "center",
  },
  backButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#0f0f0f",
    alignItems: "center",
    justifyContent: "center",
  },
  title: { color: "#fff", fontSize: 17, fontWeight: "700" },
  subtitle: { color: "#777", fontSize: 12, marginTop: 2 },
});
