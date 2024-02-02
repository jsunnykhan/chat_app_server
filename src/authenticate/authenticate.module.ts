import { Module } from '@nestjs/common';
import { AuthenticateService } from './authenticate.service';
import { AuthenticateController } from './authenticate.controller';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Password } from './entities/password.entity';
import { UserEntity } from 'src/user/entities/user.entity';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, Password]),
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET_KEY,
    }),
  ],
  controllers: [AuthenticateController],
  providers: [AuthenticateService],
})
export class AuthenticateModule {}
