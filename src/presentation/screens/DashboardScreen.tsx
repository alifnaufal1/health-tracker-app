import { Gauge, MapPin } from "lucide-react-native";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ActiveRunHeader } from "../components/ActiverunHeader";
import { HeartRateCard } from "../components/HeartRateCard";
import { StatCard } from "../components/StatCard";
import { StepsCard } from "../components/Stepscard";
import { StopButton } from "../components/StopButton";
import { SyncStatusBar } from "../components/SyncStatusBar";

// TODO: replace this hardcoded object with real data from useBle() / run tracking state
const MOCK_RUN_DATA = {
  elapsedLabel: "32:57",
  isConnected: true,
  heartRate: {
    bpm: 148,
    zoneLabel: "Zone 3 - Cardio",
    activeBars: 4,
    currentBarIndex: 3,
  },
  steps: 5771,
  pace: { value: "7:19", unit: "min/km" },
  distance: { value: "4.50", unit: "kilometers" },
  calories: { value: "237", unit: "kcal" },
  cadence: { value: "172", unit: "spm" },
  syncLabel: "Syncing to server...",
  isSyncing: true,
};

export default function DashboardScreen() {
  const data = MOCK_RUN_DATA;

  const handleStop = () => {
    // TODO: wire up to actual "stop run" logic
    console.log("Stop pressed");
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <ActiveRunHeader
          elapsedLabel={data.elapsedLabel}
          isConnected={data.isConnected}
        />

        <HeartRateCard
          bpm={data.heartRate.bpm}
          zoneLabel={data.heartRate.zoneLabel}
          activeBars={data.heartRate.activeBars}
          currentBarIndex={data.heartRate.currentBarIndex}
        />

        <StepsCard steps={data.steps} />

        <View style={styles.row}>
          <StatCard
            label="PACE"
            value={data.pace.value}
            unit={data.pace.unit}
            icon={Gauge}
          />
          <StatCard
            label="DISTANCE"
            value={data.distance.value}
            unit={data.distance.unit}
            icon={MapPin}
          />
        </View>

        <View style={styles.row}>
          <StatCard
            label="Calories"
            value={data.calories.value}
            unit={data.calories.unit}
            variant="compact"
          />
          <StatCard
            label="Cadence"
            value={data.cadence.value}
            unit={data.cadence.unit}
            variant="compact"
          />
        </View>

        <View style={styles.spacer} />

        <SyncStatusBar label={data.syncLabel} isSyncing={data.isSyncing} />

        <StopButton onPress={handleStop} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#000",
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 12,
    gap: 14,
  },
  row: {
    flexDirection: "row",
    gap: 12,
  },
  spacer: {
    flex: 1,
  },
});
