import { User } from "../../domain/entities/User";

export class UserModel {
  constructor(
    public user_id: string,
    public name: string,
    public username: string,
    public nickname: string,
  ) {}

  static fromJson(json: any): UserModel {
    return new UserModel(json.user_id, json.name, json.username, json.nickname);
  }

  toEntity(): User {
    return {
      user_id: this.user_id,
      name: this.name,
      username: this.username,
      nickname: this.nickname,
    };
  }
}
