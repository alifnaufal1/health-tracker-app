import { Buffer } from "buffer";
import { RunData } from "../../domain/entities/RunData";

/**
 * Model untuk data mentah dari service feea (fee1/fee3).
 * Struktur byte-nya belum sepenuhnya diketahui (lihat catatan investigasi
 * di ble.experimental.datasource.ts), jadi untuk sekarang cuma diteruskan
 * sebagai base64 mentah. Kalau nanti pola byte-nya sudah pasti
 * (misal fee1 = [stepCount, ?, timeCounter]), tambahkan method decode
 * di sini, persis seperti pola HeartRateModel.fromBase64().
 */
export class RunRawDataModel {
  constructor(
    public characteristicId: string,
    public rawBase64: string,
    public steps: number,
    public distance: number,
    public calory: number,
  ) {}

  static fromNotification(
    characteristicId: string,
    base64Value: string,
  ): RunRawDataModel {
    const rawBytes = Buffer.from(base64Value, "base64");

    const steps = Buffer.from([rawBytes[0], rawBytes[1]]).readUInt16LE(0);
    const distance = Buffer.from([rawBytes[3], rawBytes[4]]).readUInt16LE(0);
    const calory = Buffer.from([rawBytes[6], rawBytes[7]]).readUInt16LE(0);

    return new RunRawDataModel(
      characteristicId,
      base64Value,
      steps,
      distance,
      calory,
    );
  }

  toEntity(): RunData {
    return {
      characteristicId: this.characteristicId,
      steps: this.steps,
      distance: this.distance,
      calory: this.calory,
    };
  }
}
