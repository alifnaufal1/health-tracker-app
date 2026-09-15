import { GetSavedDevice } from "@/domain/usecases/GetSavedDeviceId";
import { StoreSession } from "@/domain/usecases/StoreDeviceSession";
import { DeviceRepositoryImpl } from "../../data/repositories/DeviceRepositoryImpl";
import { RegisterDevice } from "../../domain/usecases/RegisterDevice";

const deviceRepository = new DeviceRepositoryImpl();

export const deviceContainer = {
  registerDevice: new RegisterDevice(deviceRepository),
  storeSession: new StoreSession(deviceRepository),
  getSavedDevice: new GetSavedDevice(deviceRepository),
};
