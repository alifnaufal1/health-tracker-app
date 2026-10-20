export interface RegisterUserResponse {
  user_id: string;
  username: string;
  name: string;
}
export interface LoginUserResponse {
  token: string;
  user: RegisterUserResponse;
}
