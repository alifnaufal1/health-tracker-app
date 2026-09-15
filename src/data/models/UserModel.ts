import { User } from "../../domain/entities/User";

export class UserModel {
  constructor(
    public user_id: string,
    public name: string,
    public username: string,
    public nickname: string,
  ) {}

  static fromJson(json: any): UserModel {
    console.info("UserModel.fromJson().json: ", json);
    return new UserModel(json.user_id, json.name, json.username, json.nickname);
  }

  toEntity(): User {
    return {
      id: this.user_id,
      name: this.name,
      username: this.username,
      nickname: this.nickname,
    };
  }
}
