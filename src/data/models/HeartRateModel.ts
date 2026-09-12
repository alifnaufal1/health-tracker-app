import { Buffer } from "buffer";
import { HeartRate } from "../../domain/entities/HeartRate";

/**
 * Heart Rate Measurement (0x2A37), before being converted into an Entity.
 */
export class HeartRateModel {
  constructor(
    public rawBase64: string,
    public bpm: number,
  ) {}

  /**
   * Decode BLE standar format of Heart Rate Measurement:
   * byte 0 = flags (bit 0 determines 8-bit or 16-bit value)
   * byte 1 (and 2 if 16-bit) = BPM value
   */
  static fromBase64(base64String: string): HeartRateModel {
    console.info("fromBase64().base64String:", base64String);

    const rawBytes = Buffer.from(base64String, "base64");
    const is16Bit = (rawBytes[0] & 0x01) !== 0;
    const bpm = is16Bit ? rawBytes.readUInt16LE(1) : rawBytes[1];

    return new HeartRateModel(base64String, bpm);
  }

  toEntity(): HeartRate {
    return {
      bpm: this.bpm,
      timestamp: Date.now(),
    };
  }
}
