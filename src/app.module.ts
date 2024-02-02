import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserEntity } from "./user/entities/user.entity";

import { Password } from "./authenticate/entities/password.entity";
import { ConfigModule } from "@nestjs/config";
import { AuthenticateModule } from "./authenticate/authenticate.module";
import { UserModule } from "./user/user.module";
import { AccessTokenStrategy } from "./authenticate/strategy/access.strategy";
import { FriendsModule } from "./friends/friends.module";
import { StatusEntity } from "./friends/entities/status.entity";
import { CacheModule } from "@nestjs/cache-manager";

@Module({
  imports: [
    CacheModule.register({ isGlobal: true }),
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: "postgres",
      host: "localhost",
      port: 5432,
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
      entities: [UserEntity, Password, StatusEntity],
      synchronize: true,
      retryAttempts: 3,
      cache: true,
    }),

    UserModule,
    AuthenticateModule,
    FriendsModule,
  ],
  controllers: [],
  providers: [AccessTokenStrategy],
})
export class AppModule {}
