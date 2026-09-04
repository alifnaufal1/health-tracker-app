import { Platform, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { HintRow } from "../components/hint-row";
import { ThemedButton } from "../components/themed-button";
import { ThemedText } from "../components/themed-text";
import { ThemedView } from "../components/themed-view";
import { WebBadge } from "../components/web-badge";
import { BottomTabInset, MaxContentWidth, Spacing } from "../constants/theme";
import { useBle } from "../hooks/useBle";

export default function DashboardScreen() {
  const {
    isConnected,
    isConnecting,
    activeDevice,
    connectToDevice,
    disconnectFromDevice,
  } = useBle();

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ThemedView style={styles.heroSection}>
          <ThemedText type="title" style={styles.title}>
            Dashboard
          </ThemedText>
          <ThemedText>
            Status:{" "}
            {isConnecting
              ? "Connecting..."
              : isConnected
                ? "Connected"
                : "Disconnected"}
          </ThemedText>
        </ThemedView>

        <ThemedButton
          title={activeDevice ? "Disconnect" : "Connect"}
          themeColor="textSecondary"
          onPress={activeDevice ? disconnectFromDevice : connectToDevice}
        />

        {activeDevice && (
          <ThemedView style={styles.stepContainer}>
            <HintRow title="id" hint={activeDevice.id} />
          </ThemedView>
        )}

        {Platform.OS === "web" && <WebBadge />}
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    flexDirection: "row",
  },
  safeArea: {
    flex: 1,
    paddingHorizontal: Spacing.four,
    alignItems: "center",
    gap: Spacing.three,
    paddingBottom: BottomTabInset + Spacing.three,
    maxWidth: MaxContentWidth,
  },
  heroSection: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    paddingHorizontal: Spacing.four,
    gap: Spacing.four,
  },
  title: {
    textAlign: "center",
  },
  code: {
    textTransform: "uppercase",
  },
  stepContainer: {
    gap: Spacing.three,
    alignSelf: "stretch",
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.four,
    borderRadius: Spacing.four,
  },
});
