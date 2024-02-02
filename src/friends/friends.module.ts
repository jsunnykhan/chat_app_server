import { Module } from '@nestjs/common';
import { FriendsService } from './friends.service';
import { FriendsController } from './friends.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'src/user/entities/user.entity';
import { StatusEntity } from './entities/status.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, StatusEntity])],
  controllers: [FriendsController],
  providers: [FriendsService],
})
export class FriendsModule {}
