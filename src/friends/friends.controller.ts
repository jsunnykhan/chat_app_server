import { Controller, Post, Body, UseGuards, Get, Request, Param, UseInterceptors } from "@nestjs/common";
import { FriendsService } from "./friends.service";
import { CreateFriendDto } from "./dto/create-friend.dto";
import { AccessTokenGuard } from "src/authenticate/guard/accessToken.guard";
import { ConfirmFriendDto } from "./dto/confirm-friend.dto";
import { CacheInterceptor } from "@nestjs/cache-manager";
@UseInterceptors(CacheInterceptor)
@UseGuards(AccessTokenGuard)
@Controller("friends")
export class FriendsController {
  constructor(private readonly friendsService: FriendsService) {}

  @Get()
  async getFriend(@Request() reguest) {
    return await this.friendsService.getAllFriends(reguest.user.id);
  }

  @Post("request")
  sendRequest(@Body() createFriendDto: CreateFriendDto, @Request() request) {
    return this.friendsService.sendRequest(request.user.id, createFriendDto);
  }

  @Get("pending-request")
  pendingRequest(@Request() request) {
    return this.friendsService.getAllPendingRequest(request.user.id);
  }

  @Post("accept")
  acceptRequest(@Body() createFriendDto: ConfirmFriendDto) {
    return this.friendsService.acceptRequest(createFriendDto);
  }
  @Post("reject")
  rejectRequest(@Body() createFriendDto: ConfirmFriendDto) {
    return this.friendsService.rejectRequest(createFriendDto);
  }
}
