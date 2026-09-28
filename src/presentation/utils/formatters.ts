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

export const formatDurationFromSeconds = (totalSeconds: number): string => {
  const hou = Math.floor(totalSeconds / 3600);
  const min = Math.floor(totalSeconds / 60);
  const sec = Math.floor(totalSeconds % 3600);
  return `${String(hou).padStart(2, "0")}:${String(min).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
};

export const formatPace = (secPerKm: number): string => {
  const min = Math.floor(secPerKm / 60);
  const sec = Math.round(secPerKm % 60);
  return `${min}:${String(sec).padStart(2, "0")}`;
};
