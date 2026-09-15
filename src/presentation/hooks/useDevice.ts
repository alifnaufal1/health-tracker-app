import { useEffect, useRef, useState } from "react";
import { BleDevice } from "../../domain/entities/BleDevice";
import { User } from "../../domain/entities/User";
import { deviceContainer } from "../di/deviceContainer";

export const useDevice = (
  user: User | null,
  activeDevice: BleDevice | null,
) => {
  const [isDeviceRegistering, setIsRegistering] = useState(false);
  const alreadyRegisteredRef = useRef(false);

  useEffect(() => {
    if (!user || !activeDevice) return;
    if (alreadyRegisteredRef.current) return;

    const register = async () => {
      setIsRegistering(true);
      try {
        await deviceContainer.registerDevice.execute({
          deviceId: activeDevice.id,
          deviceName: activeDevice.name ?? "Unknown Device",
          manufacturerName: "Test",
          localName: activeDevice.localName ?? "Unknown Device",
          userId: user.id,
        });
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
