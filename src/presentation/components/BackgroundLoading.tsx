import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

type BackgroundLoadingProps = {
  isRestoring: boolean;
  isRegistering: boolean;
  isConnecting: boolean;
};

export const BackgroundLoading = ({
  isRestoring,
  isRegistering,
  isConnecting,
}: BackgroundLoadingProps) => (
  <View style={styles.overlay}>
    <ActivityIndicator size="large" color="#22c55e" />
    <Text style={styles.text}>
      {isRestoring
        ? "We are looking for your data."
        : isRegistering
          ? "We are registering you."
          : isConnecting
            ? "We are connecting to your device."
            : "Wait for seconds"}
    </Text>
  </View>
);

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  text: {
    fontSize: 13,
    fontWeight: "600",
    color: "#22c55e",
  },
});
