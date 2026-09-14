import { Pressable, StyleSheet, Text, View } from "react-native";
import { ConnectionBadge } from "./ConnectionBadge";

type HeaderProps = {
  label: string;
  isConnected: boolean;
  isMonitoring: boolean;
  onPress: () => void;
};

export function Header({
  label,
  isConnected,
  isMonitoring,
  onPress,
}: HeaderProps) {
  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.eyebrow}>
          {isMonitoring ? "ACTIVE RUN" : "Hello,"}
        </Text>
        <Text style={styles.timer}>{label}</Text>
      </View>
      <Pressable onPress={onPress}>
        <ConnectionBadge isConnected={isConnected} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  eyebrow: {
    color: "#888",
    fontSize: 12,
    fontWeight: "600",
    letterSpacing: 1,
    marginBottom: 4,
  },
  timer: {
    color: "#fff",
    fontSize: 34,
    fontWeight: "700",
  },
});
