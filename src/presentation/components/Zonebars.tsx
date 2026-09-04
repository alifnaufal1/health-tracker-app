import { StyleSheet, View } from "react-native";

type ZoneBarsProps = {
  totalBars?: number;
  activeBars: number; // how many bars are "filled" (reached)
  currentBarIndex: number; // which single bar is the bright "current zone" bar
};

export function ZoneBars({
  totalBars = 9,
  activeBars,
  currentBarIndex,
}: ZoneBarsProps) {
  return (
    <View style={styles.row}>
      {Array.from({ length: totalBars }).map((_, index) => {
        const isCurrent = index === currentBarIndex;
        const isPassed = index < activeBars;

        return (
          <View
            key={index}
            style={[
              styles.bar,
              isCurrent && styles.barCurrent,
              !isCurrent && isPassed && styles.barPassed,
              !isCurrent && !isPassed && styles.barIdle,
            ]}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    gap: 4,
    marginTop: 12,
  },
  bar: {
    flex: 1,
    height: 6,
    borderRadius: 3,
  },
  barCurrent: {
    backgroundColor: "#22c55e",
    height: 8,
  },
  barPassed: {
    backgroundColor: "rgba(34,197,94,0.55)",
  },
  barIdle: {
    backgroundColor: "rgba(255,255,255,0.08)",
  },
});
