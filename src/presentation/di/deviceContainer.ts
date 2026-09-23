import { GetUserDevice } from "@/domain/usecases/GetUserDevice";
import { DeviceRepositoryImpl } from "../../data/repositories/DeviceRepositoryImpl";
import { RegisterDevice } from "../../domain/usecases/RegisterDevice";

const deviceRepository = new DeviceRepositoryImpl();

export const deviceContainer = {
  registerDevice: new RegisterDevice(deviceRepository),
  getUserDevice: new GetUserDevice(deviceRepository),
};
