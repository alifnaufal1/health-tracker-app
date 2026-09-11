import { Buffer } from "buffer";
import { HeartRate } from "../../domain/entities/HeartRate";

export const mapToHeartRate = (base64String: string): HeartRate => {
  const rawBytes = Buffer.from(base64String, "base64");
  const is16Bit = (rawBytes[0] & 0x01) !== 0;
  const bpm = is16Bit ? rawBytes.readUInt16LE(1) : rawBytes[1];

  return {
    bpm,
    timestamp: Date.now(),
  };
};
