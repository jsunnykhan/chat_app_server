import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable } from '@nestjs/common';
import { UserEntity } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(
  Strategy,
  'access_token',
) {
  constructor(
    private config: ConfigService,
    @InjectRepository(UserEntity)
    private readonly userResporitory: Repository<UserEntity>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.get('JWT_SECRET_KEY'),
    });
  }

  async validate(payload: any) {
    const isExists = await this.userResporitory.find({
      where: { uuid: payload.id },
    });
    const hasSession = payload.exp >= Math.floor(Date.now() / 1000);
    if (isExists && hasSession) return payload;
  }
}
