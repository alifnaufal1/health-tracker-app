import React from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

type SyncStatusBarProps = {
  label: string; // e.g. "Syncing to server..."
  isSyncing: boolean;
};

export function SyncStatusBar({ label, isSyncing }: SyncStatusBarProps) {
  return (
    <View style={styles.container}>
      <View style={styles.left}>
        {isSyncing ? (
          <ActivityIndicator size="small" color="#22c55e" />
        ) : (
          <View style={styles.idleDot} />
        )}
        <Text style={styles.label}>{label}</Text>
      </View>
      <View style={styles.statusDot} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#0f0f0f",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  left: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  idleDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: "#22c55e",
  },
  label: {
    color: "#bbb",
    fontSize: 14,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#22c55e",
  },
});
