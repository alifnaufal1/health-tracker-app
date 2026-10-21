export interface IAuthSessionRepository {
  saveToken(token: string): Promise<void>;
}
