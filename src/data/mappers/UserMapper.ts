import { User } from "@/domain/entities/User";
import { RegisterUserResponse } from "../dto/UserDto";

export const UserMapper = {
  toEntity(dto: RegisterUserResponse): User {
    return {
      userId: dto.user_id,
      name: dto.name,
      username: dto.username,
    };
  },
};
