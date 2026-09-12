import { Gauge, MapPin } from "lucide-react-native";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ActiveRunHeader } from "../components/ActiverunHeader";
import { BackgroundLoading } from "../components/BackgroundLoading";
import { HeartRateCard } from "../components/HeartRateCard";
import { StatCard } from "../components/StatCard";
import { StepsCard } from "../components/Stepscard";
import { PlayButton } from "../components/StopButton";
import { SyncStatusBar } from "../components/SyncStatusBar";
import { useBle } from "../hooks/useBle";

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
  const {
    isConnected,
    isConnecting,
    activeDevice,
    heartRate,
    isMonitoring,
    runningData,
    connectToDevice,
    disconnectFromDevice,
    startMonitoring,
    stopMonitoring,
  } = useBle();

  const data = MOCK_RUN_DATA;

  const handleMonitorToggle = () => {
    if (isMonitoring) {
      stopMonitoring();
    } else {
      startMonitoring();
    }
  };

  const handleConnection = () => {
    if (isConnected && activeDevice) {
      disconnectFromDevice();
    } else {
      connectToDevice();
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <>
        {isConnecting && <BackgroundLoading />}
        <View style={styles.container}>
          <ActiveRunHeader
            elapsedLabel={data.elapsedLabel}
            isConnected={isConnected}
            onPress={handleConnection}
          />

          <HeartRateCard
            bpm={heartRate}
            zoneLabel={data.heartRate.zoneLabel}
            activeBars={data.heartRate.activeBars}
            currentBarIndex={data.heartRate.currentBarIndex}
          />

          <StepsCard steps={runningData?.steps} />

          <View style={styles.row}>
            <StatCard
              label="PACE"
              value={data.pace.value}
              unit={data.pace.unit}
              icon={Gauge}
            />
            <StatCard
              label="DISTANCE"
              value={runningData?.distance.toString() ?? "0"}
              unit={data.distance.unit}
              icon={MapPin}
            />
          </View>

          <View style={styles.row}>
            <StatCard
              label="Calories"
              value={runningData?.calory.toString() ?? "0"}
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

          <SyncStatusBar label={data.syncLabel} isSyncing={false} />

          <PlayButton onPress={handleMonitorToggle} isPlaying={isMonitoring} />
        </View>
      </>
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
    paddingTop: 40,
    gap: 14,
  },
  row: {
    flexDirection: "row",
    gap: 12,
  },
  spacer: {
    flex: 1,
  },
  instructionBanner: {
    backgroundColor: "rgba(34,197,94,0.1)",
    borderWidth: 1,
    borderColor: "rgba(34,197,94,0.3)",
    borderRadius: 12,
    padding: 12,
  },
  instructionText: {
    color: "#22c55e",
    fontSize: 13,
    textAlign: "center",
  },
});
