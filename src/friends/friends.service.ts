import { Injectable } from '@nestjs/common';
import { CreateFriendDto } from './dto/create-friend.dto';
import { ConfirmFriendDto } from './dto/confirm-friend.dto';

@Injectable()
export class FriendsService {
  getAllPendingRequest(userIdDto: CreateFriendDto) {
    console.log(userIdDto);
  }
  sendRequest(createFriendDto: CreateFriendDto) {
    console.log(createFriendDto);
    return 'This action adds a new friend';
  }
  acceptRequest(confirmFriendDto: ConfirmFriendDto) {
    console.log(confirmFriendDto);
    return 'This action adds a new friend';
  }
  rejectRequest(rejectFriendDto: ConfirmFriendDto) {
    console.log(rejectFriendDto);
    return 'This action adds a new friend';
  }
}
