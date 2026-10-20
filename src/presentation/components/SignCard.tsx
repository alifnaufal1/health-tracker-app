import { useRouter } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { SignButton } from "./SignButton";

export function SignCard() {
  const router = useRouter();

  return (
    <View style={styles.card}>
      <View style={styles.left}>
        <Text style={styles.label}>You're not signed in</Text>
        <Text style={styles.subLabel}>Sign in to upload your runs.</Text>
      </View>

      <View style={styles.right}>
        <SignButton
          forSignIn={true}
          onPress={() => router.push("/auth/signin")}
        />
        <SignButton
          forSignIn={false}
          onPress={() => router.push("/auth/signup")}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#111111",
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "#1e1e1e",
    paddingHorizontal: 18,
    paddingVertical: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  left: {
    flexDirection: "column",
    alignItems: "flex-start",
  },
  label: {
    color: "#C7C7C7",
    fontSize: 13,
    lineHeight: 16.3,
    fontWeight: "600",
    letterSpacing: 0,
  },
  subLabel: {
    color: "#555",
    fontSize: 11,
    lineHeight: 16.5,
    fontWeight: "400",
    letterSpacing: 0,
  },
  right: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 4,
  },
  value: {
    color: "#fff",
    fontSize: 30,
    fontWeight: "800",
  },
  unit: {
    color: "#777",
    fontSize: 14,
    marginBottom: 4,
  },
});
