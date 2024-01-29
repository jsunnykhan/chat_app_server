import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Request,
} from '@nestjs/common';
import { FriendsService } from './friends.service';
import { CreateFriendDto } from './dto/create-friend.dto';
import { AccessTokenGuard } from 'src/authenticate/guard/accessToken.guard';
import { ConfirmFriendDto } from './dto/confirm-friend.dto';

@UseGuards(AccessTokenGuard)
@Controller('friend')
export class FriendsController {
  constructor(private readonly friendsService: FriendsService) {}

  @Post('request')
  sendRequest(@Body() createFriendDto: CreateFriendDto) {
    return this.friendsService.sendRequest(createFriendDto);
  }

  @Get('pending-request')
  pendingRequest(@Request() request) {
    console.log(request);
  }

  @Post('accept')
  acceptRequest(@Body() createFriendDto: ConfirmFriendDto) {
    return this.friendsService.acceptRequest(createFriendDto);
  }
  @Post('reject')
  rejectRequest(@Body() createFriendDto: ConfirmFriendDto) {
    return this.friendsService.rejectRequest(createFriendDto);
  }
}
