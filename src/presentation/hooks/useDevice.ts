import { Device } from "@/domain/entities/Device";
import { useEffect, useRef, useState } from "react";
import { BleDevice } from "../../domain/entities/BleDevice";
import { User } from "../../domain/entities/User";
import { deviceContainer } from "../di/deviceContainer";

export const useDevice = (
  user: User | null,
  activeDevice: BleDevice | null,
) => {
  const [isDeviceRegistering, setIsRegistering] = useState(false);
  const [userDevice, setUserDevice] = useState<Device | null>(null);

  const alreadyRegisteredRef = useRef(false);

  useEffect(() => {
    const restore = async () => {
      const userDevice = await deviceContainer.getUserDevice.execute();
      setUserDevice(userDevice || null);
    };
    restore();
  }, []);

  useEffect(() => {
    if (!user || !activeDevice || userDevice) return;
    if (alreadyRegisteredRef.current) return;

    const register = async () => {
      setIsRegistering(true);
      try {
        const registeredDevice = await deviceContainer.registerDevice.execute({
          deviceId: activeDevice.id,
          deviceName: activeDevice.name ?? "Unknown Device",
          manufacturerName: "Test",
          localName: activeDevice.localName ?? "Unknown Device",
        });
        setUserDevice(registeredDevice);
        alreadyRegisteredRef.current = true;
      } catch (error) {
        console.error("Failed to register the device with the server:", error);
      } finally {
        setIsRegistering(false);
      }
    };

    register();
  }, [user, activeDevice]);

  return { isDeviceRegistering };
};
