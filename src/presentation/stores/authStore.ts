import type { AuthState, SettledAuthState } from "@/domain/entities/AuthState";
import type { User } from "@/domain/entities/User";
import { create } from "zustand";

type AuthStore = {
  auth: AuthState;
  sessionRestored: (result: SettledAuthState) => void;
  signedIn: (user: User) => void;
  signedOut: () => boolean;
};

const rejected = (action: string, from: AuthState["status"]) => {
  if (__DEV__)
    console.warn(`[authStore] ${action} ignored when status "${from}"`);
};

export const useAuthStore = create<AuthStore>()((set, get) => ({
  auth: { status: "checking" },

  sessionRestored: (result) => {
    const from = get().auth.status;
    if (from !== "checking") return rejected("sessionRestored", from);
    set({ auth: result });
  },

  signedIn: (user) => {
    const from = get().auth.status;
    if (from !== "signed_out") return rejected("signedIn", from);
    set({ auth: { status: "signed_in", user } });
  },

  signedOut: () => {
    if (get().auth.status !== "signed_in") return false;
    set({ auth: { status: "signed_out" } });
    return true;
  },
}));
