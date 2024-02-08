import { FindOptionsSelect } from "typeorm";
import { UserEntity } from "../entities/user.entity";

export const selectedUserOptions: FindOptionsSelect<UserEntity> = {
  created_at: true,
  updated_at: false,
  last_update: false,
  uuid: true,
  id: false,
  email: true,
};
