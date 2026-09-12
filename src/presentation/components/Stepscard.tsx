import { PersonStanding } from "lucide-react-native";
import { StyleSheet, Text, View } from "react-native";

type StepsCardProps = {
  steps?: number;
};

export function StepsCard({ steps }: StepsCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.left}>
        <PersonStanding size={16} color="#999" />
        <Text style={styles.label}>STEPS</Text>
      </View>

      <View style={styles.valueRow}>
        <Text style={styles.value}>{steps?.toLocaleString("en-US") || 0}</Text>
        <Text style={styles.unit}>steps</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#0f0f0f",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
    paddingHorizontal: 18,
    paddingVertical: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  left: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  label: {
    color: "#999",
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  valueRow: {
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
