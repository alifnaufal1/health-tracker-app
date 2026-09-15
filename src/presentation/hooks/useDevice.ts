import { useEffect, useRef, useState } from "react";
import { BleDevice } from "../../domain/entities/BleDevice";
import { User } from "../../domain/entities/User";
import { deviceContainer } from "../di/deviceContainer";

export const useDevice = (
  user: User | null,
  activeDevice: BleDevice | null,
) => {
  const [isDeviceRegistering, setIsRegistering] = useState(false);
  const [savedDeviceId, setSavedDeviceId] = useState<string | null>(null);

  const alreadyRegisteredRef = useRef(false);

  useEffect(() => {
    const restore = async () => {
      const savedUser = await deviceContainer.getSavedDevice.execute();
      setSavedDeviceId(savedUser?.deviceId || null);
    };
    restore();
  }, []);

  useEffect(() => {
    if (!user || !activeDevice || savedDeviceId) return;
    if (alreadyRegisteredRef.current) return;

    const register = async () => {
      setIsRegistering(true);
      try {
        const registeredDevice = await deviceContainer.registerDevice.execute({
          deviceId: activeDevice.id,
          deviceName: activeDevice.name ?? "Unknown Device",
          manufacturerName: "Test",
          localName: activeDevice.localName ?? "Unknown Device",
          userId: user.id,
        });
        await deviceContainer.storeSession.execute(registeredDevice.deviceId);
        setSavedDeviceId(registeredDevice.deviceId);
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
