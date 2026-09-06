import { ActivityIndicator, StyleSheet } from "react-native";

export const BackgroundLoading = () => (
  <ActivityIndicator size="large" color="#22c55e" style={styles.overlay} />
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
});
