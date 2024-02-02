import { Injectable, NotFoundException } from "@nestjs/common";
import { UpdateUserDto } from "./dto/update-user.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { UserEntity } from "./entities/user.entity";
import { Repository } from "typeorm";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly datasource: Repository<UserEntity>,
  ) {}

  async findAll() {
    try {
      return await this.datasource.find({
        select: {
          email: true,
          created_at: true,
          uuid: true,
          provider: true,
          updated_at: true,
        },
        order: {
          created_at: "DESC",
        },
      });
    } catch (error: any) {
      console.log(error);
    }
  }

  async findOne(id: string) {
    try {
      const data = await this.datasource.findOne({
        where: { uuid: id },
        select: {
          email: true,
          uuid: true,
          provider: true,
          created_at: true,
          updated_at: true,
        },
      });

      if (data?.uuid) return data;
      else throw new NotFoundException("No user found");
    } catch (error: any) {
      throw error;
    }
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    // try {
    //   const data = await this.datasource.update({ uuid: id }, updateUserDto);
    //   console.log(data);
    //   if (data.affected > 0) return updateUserDto;
    //   else throw new NotFoundException();
    // } catch (error: any) {
    //   throw error;
    // }
  }

  async remove(id: string) {
    try {
      const data = await this.datasource.delete({ uuid: id });
      if (data.affected > 0) return {};
      else new NotFoundException();
    } catch (error: any) {
      throw error;
    }
  }
}
