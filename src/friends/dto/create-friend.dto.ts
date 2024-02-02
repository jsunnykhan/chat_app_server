import { IsUUID } from 'class-validator';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { FriendStatus } from '../entities/status.entity';

export class CreateFriendDto {
  @IsUUID()
  id: string;
  user: CreateUserDto;

  status: FriendStatus;
}
