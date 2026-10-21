import { Auth } from "@/domain/entities/Auth";
import { LoginUserResponse } from "../dto/UserDto";
import { UserMapper } from "./UserMapper";

export const AuthMapper = {
  toEntity(dto: LoginUserResponse): Auth {
    return {
      token: dto.token,
      user: UserMapper.toEntity(dto.user),
    };
  },
};
