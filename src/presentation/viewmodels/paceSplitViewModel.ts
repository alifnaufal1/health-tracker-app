import { PaceSplit } from "@/domain/entities/Workout";
import { formatPace } from "../utils/formatters";

export type PaceSplitViewModel = {
  km: string;
  paceLabel: string;
  avgBpm: number;
  barWidthPercent: number;
  type: PaceSplit["type"];
};

export const toPaceSplitViewModels = (
  splits: PaceSplit[],
): PaceSplitViewModel[] => {
  if (splits.length === 0) return [];

  const bestPace = Math.min(...splits.map((s) => s.paceSecPerKm));

  return splits.map((split, i) => ({
    km: `K${i + 1}`,
    paceLabel: formatPace(split.paceSecPerKm),
    avgBpm: Math.round(split.avgHeartRate),
    barWidthPercent: (bestPace / split.paceSecPerKm) * 100,
    type: split.type,
  }));
};
