import { WorkoutSample } from "@/domain/entities/WorkoutSample";
import { Buffer } from "buffer";

export const deviceNotificationMapper = {
  toEntity(base64Value: string): WorkoutSample {
    const rawBytes = Buffer.from(base64Value, "base64");

    const steps = Buffer.from([rawBytes[0], rawBytes[1]]).readUInt16LE(0);
    const distance = Buffer.from([rawBytes[3], rawBytes[4]]).readUInt16LE(0);
    const calories = Buffer.from([rawBytes[6], rawBytes[7]]).readUInt16LE(0);
    return {
      timestamp: Date.now(),
      steps: steps,
      distance: distance,
      calories: calories,
    };
  },
};
