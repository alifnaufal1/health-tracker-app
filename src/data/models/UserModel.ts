import { User } from "../../domain/entities/User";

export class UserModel {
  constructor(
    public id: string,
    public name: string,
    public nick_name: string,
  ) {}

  static fromJson(json: any): UserModel {
    return new UserModel(json.id, json.full_name, json.email);
  }

  toEntity(): User {
    return {
      id: this.id,
      name: this.name,
      nickname: this.nick_name,
    };
  }
}
