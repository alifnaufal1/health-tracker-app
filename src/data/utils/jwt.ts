import { jwtDecode } from "jwt-decode";

export const readTokenExpiry = (token: string): number | null => {
  try {
    const { exp } = jwtDecode<{ exp?: number }>(token);
    const expInSec = typeof exp === "number" ? exp * 1000 : null;
    return expInSec;
  } catch {
    return null;
  }
};
