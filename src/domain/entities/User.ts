export type User = {
  userId: string;
  name: string;
  username: string;
};

export type LoginResult =
  | { status: "signed_in"; user: User }
  | { status: "sign_in_failed" }
  | { status: "invalid_credentials" };

export type RegisterResult = LoginResult | { status: "username_taken" };
