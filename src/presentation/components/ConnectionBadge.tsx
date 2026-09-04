import { Bluetooth } from "lucide-react-native";
import { StyleSheet, Text, View } from "react-native";

type ConnectionBadgeProps = {
  isConnected: boolean;
};

export function ConnectionBadge({ isConnected }: ConnectionBadgeProps) {
  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: isConnected
            ? "rgba(34,197,94,0.12)"
            : "rgba(255,255,255,0.06)",
        },
      ]}
    >
      <View
        style={[
          styles.dot,
          { backgroundColor: isConnected ? "#22c55e" : "#666" },
        ]}
      />
      <Bluetooth size={14} color={isConnected ? "#22c55e" : "#888"} />
      <Text style={[styles.label, { color: isConnected ? "#22c55e" : "#888" }]}>
        {isConnected ? "Connected" : "Disconnected"}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
  },
});
