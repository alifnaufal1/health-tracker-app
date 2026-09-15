import { User } from "../../domain/entities/User";

export class UserModel {
  constructor(
    public user_id: string,
    public name: string,
    public nick_name: string,
  ) {}

  static fromJson(json: any): UserModel {
    return new UserModel(json.user_id, json.name, json.nick_name);
  }

  toEntity(): User {
    return {
      id: this.user_id,
      name: this.name,
      nickname: this.nick_name,
    };
  }
}
