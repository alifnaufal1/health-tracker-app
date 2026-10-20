import { Pressable, StyleSheet, Text } from "react-native";

type SignButtonProps = {
  forSignIn: boolean;
  onPress: any;
};

export function SignButton({ forSignIn, onPress }: SignButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      style={[
        {
          backgroundColor: forSignIn ? "#111" : "#00E676",
          borderColor: forSignIn ? "#333" : "#00E676",
        },
        styles.container,
      ]}
    >
      <Text
        style={[styles.label, { color: forSignIn ? "#B8B8B8" : "#09130D" }]}
      >
        {forSignIn ? "Sign in" : "Sign up"}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    height: 30,
    paddingHorizontal: 12,
    borderRadius: 9,
    borderWidth: 1,
  },
  label: {
    fontSize: 11,
    fontWeight: "600",
    lineHeight: 16.5,
    color: "#B8B8B8",
  },
});
