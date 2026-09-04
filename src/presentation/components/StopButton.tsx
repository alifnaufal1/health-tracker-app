import React from "react";
import { Pressable, StyleSheet, View } from "react-native";

type StopButtonProps = {
  onPress: () => void;
};

export function StopButton({ onPress }: StopButtonProps) {
  return (
    <Pressable onPress={onPress} style={styles.ring}>
      <View style={styles.square} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  ring: {
    alignSelf: "center",
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "rgba(239,68,68,0.15)",
    alignItems: "center",
    justifyContent: "center",
  },
  square: {
    width: 26,
    height: 26,
    borderRadius: 6,
    backgroundColor: "#ef4444",
  },
});
