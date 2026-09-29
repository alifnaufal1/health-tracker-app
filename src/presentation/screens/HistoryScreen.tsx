import { useRouter } from "expo-router";
import { useEffect } from "react";
import { Alert, FlatList, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { HistoryHeader } from "../components/HistoryHeader";
import { WorkoutHistoryCard } from "../components/WorkoutHistoryCard";
import { useDevice } from "../hooks/useDevice";
import { useWorkoutHistory } from "../hooks/useWorkoutHistory";

export default function HistoryScreen() {
  const router = useRouter();
  const { userDevice } = useDevice(null, null);
  const { data, loading, error, refetch } = useWorkoutHistory(
    userDevice?.deviceId,
  );

  useEffect(() => {
    if (error) {
      Alert.alert("Failed to load history", error, [
        { text: "Retry", onPress: refetch },
        { text: "OK" },
      ]);
    }
  }, [error, refetch]);

  console.info("History");
  console.info("userDevice:", userDevice);

  return (
    <SafeAreaView style={styles.safeArea}>
      <FlatList
        data={data}
        onRefresh={refetch}
        refreshing={loading}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <HistoryHeader totalRuns={data.length} loading={loading} />
        }
        ItemSeparatorComponent={() => <FlatListSeparator />}
        ListEmptyComponent={() => <Text>Empty</Text>}
        renderItem={({ item }) => {
          return (
            <WorkoutHistoryCard
              workout={item}
              onPress={() => router.push(`/summary/${item.id}?from=history`)}
            />
          );
        }}
      />
    </SafeAreaView>
  );
}

function FlatListSeparator() {
  return <View style={{ height: 14 }} />;
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#000" },
  listContent: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 40,
    gap: 14,
  },
});
