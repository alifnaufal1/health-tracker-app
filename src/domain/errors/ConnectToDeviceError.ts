export type ConnectToDeviceErrorCode =
  | "REQUEST_PERMISSION"
  | "BLUETOOTH_OFF"
  | "SCAN_TIMEOUT"
  | "CONNECT_FAILED";

export class ConnectToDeviceError extends Error {
  constructor(
    public readonly code: ConnectToDeviceErrorCode,
    message: string,
    public readonly cause?: unknown,
  ) {
    super(message);
    this.name = "ConnectToDeviceError";
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export const isConnectToDeviceError = (
  e: unknown,
  code?: ConnectToDeviceErrorCode,
): e is ConnectToDeviceError =>
  e instanceof ConnectToDeviceError && (code === undefined || e.code === code);
