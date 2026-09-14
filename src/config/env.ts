const requireEnv = (name: string, value: string | undefined): string => {
  if (!value) {
    throw new Error(`Env var "${name}" Not Found.`);
  }
  return value;
};

export const env = {
  apiBaseUrl: requireEnv(
    "EXPO_PUBLIC_API_BASE_URL",
    process.env.EXPO_PUBLIC_API_BASE_URL,
  ),
  apiTimeoutMs: Number(process.env.EXPO_PUBLIC_API_TIMEOUT_MS ?? 15000),
  isWorkoutTriggerEnabled:
    process.env.EXPO_PUBLIC_ENABLE_WORKOUT_TRIGGER_FEATURE === "true",
};
