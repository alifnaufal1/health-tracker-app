import type { User } from "./User";

export type AuthState =
  | { status: "checking" }
  | { status: "signed_in"; user: User }
  | { status: "signed_out" };

export type SettledAuthState = Exclude<AuthState, { status: "checking" }>;
