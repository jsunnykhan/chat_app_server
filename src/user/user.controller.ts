import { Controller, Get, Body, Patch, Param, Delete, UseGuards } from "@nestjs/common";
import { UserService } from "./user.service";
import { UpdateUserDto } from "./dto/update-user.dto";
import { AccessTokenGuard } from "src/authenticate/guard/accessToken.guard";
@UseGuards(AccessTokenGuard)
@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get("users")
  async findAll() {
    return await this.userService.findAll();
  }

  @Get("user/:id")
  async findOne(@Param("id") id: string) {
    return await this.userService.findOne(id);
  }

  @Patch("user/:id")
  async update(@Param("id") id: string, @Body() updateUserDto: UpdateUserDto) {
    return await this.userService.update(id, updateUserDto);
  }

  @Delete("user/:id")
  async remove(@Param("id") id: string) {
    return await this.userService.remove(id);
  }

  
}
