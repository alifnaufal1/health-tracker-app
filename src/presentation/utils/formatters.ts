export const formatDate = (date: Date): string =>
  date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

export const formatTime12Hour = (date: Date): string =>
  date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

export const formatTimeFlexibleHour = (date: Date): string =>
  date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

export const formatDurationFromSeconds = (totalSeconds: number): string => {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = Math.floor(totalSeconds % 60);

  const hStr = String(hours).padStart(2, "0");
  const mStr = String(minutes).padStart(2, "0");
  const sStr = String(seconds).padStart(2, "0");

  return `${hStr}:${mStr}:${sStr}`;
};

export const formatDurationFlexible = (totalSeconds: number): string => {
  const hours = Math.floor(totalSeconds / 3600);
  if (hours < 1) {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = Math.floor(totalSeconds % 60);
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  }
  return formatDurationFromSeconds(totalSeconds);
};

export const formatTime = (totalSeconds: number) => {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return [
    hours.toString().padStart(2, "0"),
    minutes.toString().padStart(2, "0"),
    seconds.toString().padStart(2, "0"),
  ].join(":");
};

export const formatPace = (secPerKm: number): string => {
  const min = Math.floor(secPerKm / 60);
  const sec = Math.round(secPerKm % 60);
  return `${min}:${String(sec).padStart(2, "0")}`;
};

export const formatDistanceKm = (distanceMeters: number): string =>
  (distanceMeters / 1000).toFixed(2);

export const formatElapsedFromStart = (
  timestamp: Date,
  startTimestamp: Date,
): string => {
  const elapsedSeconds = Math.max(
    0,
    Math.floor((timestamp.getTime() - startTimestamp.getTime()) / 1000),
  );
  const minutes = Math.floor(elapsedSeconds / 60);
  const seconds = elapsedSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
};

export function pickEvenlySpacedIndexes<T>(
  items: T[],
  getTimestamp: (item: T) => Date,
  count = 4,
): Set<number> {
  if (items.length === 0) return new Set();
  if (items.length <= count) {
    return new Set(items.map((_, i) => i));
  }

  const startMs = getTimestamp(items[0]).getTime();
  const endMs = getTimestamp(items[items.length - 1]).getTime();
  const totalMs = endMs - startMs;

  const indexes = new Set<number>();

  for (let step = 0; step < count; step++) {
    const targetMs = startMs + (totalMs * step) / (count - 1);

    let closestIndex = 0;
    let closestDiff = Infinity;
    for (let i = 0; i < items.length; i++) {
      const diff = Math.abs(getTimestamp(items[i]).getTime() - targetMs);
      if (diff < closestDiff) {
        closestDiff = diff;
        closestIndex = i;
      }
    }
    indexes.add(closestIndex);
  }

  return indexes;
}

export function pickEvenlySpacedValues(
  min: number,
  max: number,
  count = 4,
): number[] {
  if (count <= 1) return [max];

  const values: number[] = [];
  for (let i = 0; i < count; i++) {
    const value = max - ((max - min) * i) / (count - 1);
    values.push(Math.round(value));
  }
  return values;
}
