import { DisconnectDevice } from "@/domain/usecases/DisconectDevice";
import { BleRepositoryImpl } from "../../data/repositories/BleRepositoryImpl";
import { ConnectToDevice } from "../../domain/usecases/ConnectToDevice";
import { StartRunMonitoring } from "../../domain/usecases/StartWorkoutMonitoring";

const bleRepository = new BleRepositoryImpl({ scanTimeoutMs: 30_000 });

export const bleContainer = {
  connectToDevice: new ConnectToDevice(bleRepository),
  disconnectDevice: new DisconnectDevice(bleRepository),
  startWorkoutMonitoring: new StartRunMonitoring(bleRepository),
  repository: bleRepository,
};
