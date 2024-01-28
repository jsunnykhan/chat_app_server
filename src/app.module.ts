import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user/entities/user.entity';

import { Password } from './authenticate/entities/password.entity';
import { ConfigModule } from '@nestjs/config';
import { AuthenticateModule } from './authenticate/authenticate.module';
import { UserModule } from './user/user.module';
import { AccessTokenStrategy } from './authenticate/strategy/access.strategy';
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
      entities: [User, Password],
      synchronize: true,
      retryAttempts: 3,
    }),
    UserModule,
    AuthenticateModule,
  ],
  controllers: [],
  providers: [AccessTokenStrategy],
})
export class AppModule {}
