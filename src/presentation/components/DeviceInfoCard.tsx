import React from "react";
import { BatteryMedium, Smartphone } from "lucide-react-native";
import { Pressable, StyleSheet, Text, View } from "react-native";

type DeviceInfoCardProps = {
  isConnected: boolean;
  batteryPercent: number;
  estimatedRemaining: string;
  deviceName: string;
  manufacturer: string;
  macAddress: string;
  firmware: string;
  bleProtocol: string;
  onDisconnect: () => void;
};

export function DeviceInfoCard({
  isConnected,
  batteryPercent,
  estimatedRemaining,
  deviceName,
  manufacturer,
  macAddress,
  firmware,
  bleProtocol,
  onDisconnect,
}: DeviceInfoCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <View style={styles.headerLeft}>
          <Smartphone size={14} color="#999" />
          <Text style={styles.headerLabel}>DEVICE INFORMATION</Text>
        </View>
        <View style={styles.statusRow}>
          <View style={[styles.statusDot, { backgroundColor: isConnected ? "#22c55e" : "#555" }]} />
          <Text style={[styles.statusText, { color: isConnected ? "#22c55e" : "#777" }]}>
            {isConnected ? "Connected" : "Disconnected"}
          </Text>
        </View>
      </View>

      <View style={styles.batteryBlock}>
        <View style={styles.batteryHeaderRow}>
          <View>
            <Text style={styles.batteryLabel}>BATTERY LEVEL</Text>
            <Text style={styles.batterySub}>Est. {estimatedRemaining} remaining</Text>
          </View>
          <View style={styles.batteryValueRow}>
            <BatteryMedium size={16} color="#22c55e" />
            <Text style={styles.batteryValue}>{batteryPercent}%</Text>
          </View>
        </View>
        <View style={styles.batteryTrack}>
          <View style={[styles.batteryFill, { width: `${batteryPercent}%` }]} />
        </View>
      </View>

      <InfoRow label="Device Name" value={deviceName} />
      <InfoRow label="Manufacturer" value={manufacturer} />
      <InfoRow label="MAC Address" value={macAddress} mono />
      <InfoRow label="Firmware" value={firmware} />
      <InfoRow label="BLE Protocol" value={bleProtocol} />

      <Pressable onPress={onDisconnect} style={styles.disconnectButton}>
        <Text style={styles.disconnectText}>Disconnect Watch</Text>
      </Pressable>
    </View>
  );
}

function InfoRow({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={[styles.infoValue, mono && styles.mono]}>{value}</Text>
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
  headerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 14 },
  headerLeft: { flexDirection: "row", alignItems: "center", gap: 6 },
  headerLabel: { color: "#999", fontSize: 11, fontWeight: "700", letterSpacing: 0.5 },
  statusRow: { flexDirection: "row", alignItems: "center", gap: 5 },
  statusDot: { width: 6, height: 6, borderRadius: 3 },
  statusText: { fontSize: 11, fontWeight: "700" },
  batteryBlock: {
    backgroundColor: "#1a1a1a",
    borderRadius: 12,
    padding: 12,
    marginBottom: 14,
  },
  batteryHeaderRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 8 },
  batteryLabel: { color: "#999", fontSize: 10, fontWeight: "700" },
  batterySub: { color: "#666", fontSize: 11, marginTop: 3 },
  batteryValueRow: { flexDirection: "row", alignItems: "center", gap: 5 },
  batteryValue: { color: "#22c55e", fontSize: 16, fontWeight: "800" },
  batteryTrack: { height: 6, borderRadius: 3, backgroundColor: "rgba(255,255,255,0.08)" },
  batteryFill: { height: 6, borderRadius: 3, backgroundColor: "#22c55e" },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 9,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.04)",
  },
  infoLabel: { color: "#777", fontSize: 12 },
  infoValue: { color: "#ddd", fontSize: 12, fontWeight: "600" },
  mono: { fontFamily: "monospace" },
  disconnectButton: {
    marginTop: 14,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    borderRadius: 12,
    paddingVertical: 13,
    alignItems: "center",
  },
  disconnectText: { color: "#888", fontSize: 13, fontWeight: "600" },
});
