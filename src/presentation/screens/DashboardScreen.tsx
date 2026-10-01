import { useRouter } from "expo-router";
import { Gauge, MapPin } from "lucide-react-native";
import { useEffect, useRef } from "react";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { BackgroundLoading } from "../components/BackgroundLoading";
import { Header } from "../components/Header";
import { HeartRateCard } from "../components/HeartRateCard";
import { StatCard } from "../components/StatCard";
import { StepsCard } from "../components/Stepscard";
import { PlayButton } from "../components/StopButton";
import { SyncStatusBar } from "../components/SyncStatusBar";
import { useAuth } from "../hooks/useAuth";
import { useBle } from "../hooks/useBle";
import { useDevice } from "../hooks/useDevice";
import { useErrorAlert } from "../hooks/useErrorAlert";
import { useWorkoutSession } from "../hooks/useWorkoutSession";
import { formatTime } from "../utils/formatters";

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
  const router = useRouter();
  const ble = useBle();
  const { user, isLoading, isRestoring, register } = useAuth();
  const { isDeviceRegistering } = useDevice(user, ble.activeDevice);
  const { start, stop, status, errorMessage, infoMessage } =
    useWorkoutSession(ble);
  useErrorAlert(ble.error);

  const hasAttemptedRegister = useRef(false);

  const data = MOCK_RUN_DATA;

  useEffect(() => {
    if (isRestoring) return;

    if (!user?.user_id && !hasAttemptedRegister.current) {
      hasAttemptedRegister.current = true;
      register("Agus Budi Cipto", "Agus", "AgusGanteng1");
    }
  }, [isRestoring, user]);

  const handleMonitorToggle = () => {
    if (ble.isMonitoring) stop();
    else start();
  };

  const handleConnection = () => {
    if (ble.isConnected && ble.activeDevice) {
      ble.disconnectFromDevice();
    } else {
      ble.connectToDevice();
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <>
        {(ble.isConnecting ||
          isLoading ||
          isDeviceRegistering ||
          isRestoring) && (
          <BackgroundLoading
            isRestoring={isRestoring}
            isRegistering={isLoading}
            isConnecting={ble.isConnecting}
          />
        )}
        <View style={styles.container}>
          <Header
            label={
              ble.isTimerRunning
                ? formatTime(ble.time)
                : user
                  ? user.nickname
                  : "Welcome"
            }
            isConnected={ble.isConnected}
            isMonitoring={ble.isMonitoring}
            onPress={handleConnection}
          />

          <HeartRateCard
            bpm={ble.heartRate}
            zoneLabel={data.heartRate.zoneLabel}
            activeBars={data.heartRate.activeBars}
            currentBarIndex={data.heartRate.currentBarIndex}
          />

          <StepsCard steps={ble.runningData?.steps} />

          <View style={styles.row}>
            <StatCard
              label="PACE"
              value={data.pace.value}
              unit={data.pace.unit}
              icon={Gauge}
            />
            <StatCard
              label="DISTANCE"
              value={ble.runningData?.distance.toString() ?? "0"}
              unit={data.distance.unit}
              icon={MapPin}
            />
          </View>

          <View style={styles.row}>
            <StatCard
              label="Calories"
              value={ble.runningData?.calories.toString() ?? "0"}
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

          <PlayButton
            onPress={handleMonitorToggle}
            isPlaying={ble.isMonitoring}
          />
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
