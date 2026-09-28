import React from "react";
import { UserCircle2 } from "lucide-react-native";
import { StyleSheet, Text, View } from "react-native";

export function ProfileHeader() {
  return (
    <View style={styles.row}>
      <View style={styles.iconCircle}>
        <UserCircle2 size={18} color="#22c55e" />
      </View>
      <View>
        <Text style={styles.title}>Profile & Device</Text>
        <Text style={styles.subtitle}>Manage your account and watch</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", gap: 12 },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(34,197,94,0.12)",
    alignItems: "center",
    justifyContent: "center",
  },
  title: { color: "#fff", fontSize: 18, fontWeight: "700" },
  subtitle: { color: "#777", fontSize: 12, marginTop: 2 },
});
