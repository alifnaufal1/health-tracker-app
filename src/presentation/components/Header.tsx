import { Pressable, StyleSheet, Text, View } from "react-native";
import { useAuthStore } from "../stores/authStore";
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
  const auth = useAuthStore((s) => s.auth);

  return (
    <View style={styles.container}>
      <View>
        {auth.status === "signed_in" && (
          <Text style={styles.eyebrow}>
            {isMonitoring ? "ACTIVE RUN" : "Hello,"}
          </Text>
        )}
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
