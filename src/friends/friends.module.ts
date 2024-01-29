import { Module } from '@nestjs/common';
import { FriendsService } from './friends.service';
import { FriendsController } from './friends.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Friend } from './entities/friend.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Friend])],
  controllers: [FriendsController],
  providers: [FriendsService],
})
export class FriendsModule {}
