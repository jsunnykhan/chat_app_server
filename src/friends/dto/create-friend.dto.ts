import { IsUUID } from 'class-validator';

export class CreateFriendDto {
  @IsUUID()
  id: string;
}
