import { IsUUID } from 'class-validator';
import { CreateFriendDto } from './create-friend.dto';

export class ConfirmFriendDto extends CreateFriendDto {
  @IsUUID()
  request_id: string;
}
