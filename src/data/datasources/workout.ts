export type PaceSplit = {
  km: string;
  pace: string;
  avgBpm: number;
  barWidthPercent: number;
  type: "warmup" | "fastest" | "cooldown" | "normal";
};

export type HeartRatePoint = {
  minuteLabel: string;
  bpm: number;
};

export type Workout = {
  id: string;
  dateLabel: string; // "Oct 24, 2026"
  timeLabel: string; // "6:42 AM"
  durationLabel: string; // "00:45:12"
  distanceKm: number;
  avgPace: string; // "5:22"
  avgHr: number;
  steps: number;
  calories: number;
  maxHr: number;
  heartRateSeries: HeartRatePoint[];
  splits: PaceSplit[];
};

export const WORKOUTS: Workout[] = [
  {
    id: "w1",
    dateLabel: "Oct 24, 2026",
    timeLabel: "6:42 AM",
    durationLabel: "00:45:12",
    distanceKm: 8.42,
    avgPace: "5:22",
    avgHr: 148,
    steps: 8934,
    calories: 524,
    maxHr: 162,
    heartRateSeries: [
      { minuteLabel: "0:00", bpm: 88 },
      { minuteLabel: "15:00", bpm: 140 },
      { minuteLabel: "30:00", bpm: 155 },
      { minuteLabel: "45:00", bpm: 132 },
    ],
    splits: [
      {
        km: "K1",
        pace: "5:12",
        avgBpm: 148,
        barWidthPercent: 70,
        type: "warmup",
      },
      {
        km: "K2",
        pace: "5:08",
        avgBpm: 152,
        barWidthPercent: 78,
        type: "normal",
      },
      {
        km: "K3",
        pace: "5:02",
        avgBpm: 156,
        barWidthPercent: 92,
        type: "fastest",
      },
      {
        km: "K4",
        pace: "5:15",
        avgBpm: 154,
        barWidthPercent: 66,
        type: "normal",
      },
      {
        km: "K5",
        pace: "5:18",
        avgBpm: 151,
        barWidthPercent: 60,
        type: "normal",
      },
      {
        km: "K6",
        pace: "5:22",
        avgBpm: 148,
        barWidthPercent: 52,
        type: "cooldown",
      },
    ],
  },
  {
    id: "w2",
    dateLabel: "Oct 21, 2026",
    timeLabel: "7:08 PM",
    durationLabel: "00:32:48",
    distanceKm: 6.24,
    avgPace: "5:15",
    avgHr: 145,
    steps: 6781,
    calories: 386,
    maxHr: 158,
    heartRateSeries: [
      { minuteLabel: "0:00", bpm: 85 },
      { minuteLabel: "15:00", bpm: 138 },
      { minuteLabel: "30:00", bpm: 148 },
    ],
    splits: [
      {
        km: "K1",
        pace: "5:20",
        avgBpm: 140,
        barWidthPercent: 65,
        type: "warmup",
      },
      {
        km: "K2",
        pace: "5:10",
        avgBpm: 148,
        barWidthPercent: 85,
        type: "fastest",
      },
      {
        km: "K3",
        pace: "5:15",
        avgBpm: 150,
        barWidthPercent: 72,
        type: "normal",
      },
    ],
  },
  {
    id: "w3",
    dateLabel: "Oct 18, 2026",
    timeLabel: "8:16 AM",
    durationLabel: "01:02:31",
    distanceKm: 10.76,
    avgPace: "5:49",
    avgHr: 141,
    steps: 11820,
    calories: 681,
    maxHr: 157,
    heartRateSeries: [
      { minuteLabel: "0:00", bpm: 82 },
      { minuteLabel: "20:00", bpm: 135 },
      { minuteLabel: "40:00", bpm: 149 },
      { minuteLabel: "60:00", bpm: 128 },
    ],
    splits: [
      {
        km: "K1",
        pace: "5:55",
        avgBpm: 136,
        barWidthPercent: 60,
        type: "warmup",
      },
      {
        km: "K2",
        pace: "5:50",
        avgBpm: 142,
        barWidthPercent: 66,
        type: "normal",
      },
      {
        km: "K3",
        pace: "5:40",
        avgBpm: 148,
        barWidthPercent: 80,
        type: "fastest",
      },
      {
        km: "K4",
        pace: "5:58",
        avgBpm: 140,
        barWidthPercent: 58,
        type: "cooldown",
      },
    ],
  },
  {
    id: "w4",
    dateLabel: "Sep 16, 2026",
    timeLabel: "6:30 AM",
    durationLabel: "00:50:42",
    distanceKm: 6.24,
    avgPace: "5:13",
    avgHr: 148,
    steps: 8012,
    calories: 487,
    maxHr: 158,
    heartRateSeries: [
      { minuteLabel: "0:00", bpm: 90 },
      { minuteLabel: "15:00", bpm: 142 },
      { minuteLabel: "30:00", bpm: 158 },
      { minuteLabel: "45:00", bpm: 130 },
    ],
    splits: [
      {
        km: "K1",
        pace: "5:12",
        avgBpm: 148,
        barWidthPercent: 68,
        type: "warmup",
      },
      {
        km: "K2",
        pace: "5:08",
        avgBpm: 152,
        barWidthPercent: 76,
        type: "normal",
      },
      {
        km: "K3",
        pace: "5:02",
        avgBpm: 156,
        barWidthPercent: 92,
        type: "fastest",
      },
      {
        km: "K4",
        pace: "5:15",
        avgBpm: 154,
        barWidthPercent: 64,
        type: "normal",
      },
      {
        km: "K5",
        pace: "5:18",
        avgBpm: 151,
        barWidthPercent: 58,
        type: "normal",
      },
      {
        km: "K6",
        pace: "5:22",
        avgBpm: 148,
        barWidthPercent: 50,
        type: "cooldown",
      },
    ],
  },
];
