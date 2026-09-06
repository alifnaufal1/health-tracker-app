import { Pressable, StyleSheet, Text, View } from "react-native";
import { ConnectionBadge } from "./ConnectionBadge";

type ActiveRunHeaderProps = {
  elapsedLabel: string;
  isConnected: boolean;
  onPress: () => void;
};

export function ActiveRunHeader({
  elapsedLabel,
  isConnected,
  onPress,
}: ActiveRunHeaderProps) {
  return (
    <Pressable style={styles.container} onPress={onPress}>
      <View>
        <Text style={styles.eyebrow}>ACTIVE RUN</Text>
        <Text style={styles.timer}>{elapsedLabel}</Text>
      </View>
      <ConnectionBadge isConnected={isConnected} />
    </Pressable>
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
