import { Play } from "lucide-react-native";
import { Pressable, StyleSheet, View } from "react-native";

type PlayButtonProps = {
  isPlaying: boolean;
  onPress: () => void;
};

export function PlayButton({ isPlaying, onPress }: PlayButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.ring,
        {
          backgroundColor: isPlaying
            ? "rgba(239,68,68,0.15)"
            : "rgba(34,197,94,0.15)",
        },
      ]}
    >
      {isPlaying ? (
        <View style={styles.square} />
      ) : (
        <Play size={26} color="#22c55e" />
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  ring: {
    alignSelf: "center",
    width: 72,
    height: 72,
    borderRadius: 36,
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
