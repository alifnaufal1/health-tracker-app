export interface ISessionRepository {
  saveToken(token: string): Promise<void>;
}
