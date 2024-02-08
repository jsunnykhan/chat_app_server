import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AuthenticateModule } from "./authenticate/authenticate.module";
import { UserModule } from "./user/user.module";
import { AccessTokenStrategy } from "./authenticate/strategy/access.strategy";
import { FriendsModule } from "./friends/friends.module";
import { CacheModule } from "@nestjs/cache-manager";
import { DatabaseModule } from "./database/database.module";


@Module({
  imports: [
    CacheModule.register({ isGlobal: true }),
    ConfigModule.forRoot({ isGlobal: true }),
    UserModule,
    AuthenticateModule,
    FriendsModule,
    DatabaseModule,
    
  ],
  controllers: [],
  providers: [AccessTokenStrategy],
})
export class AppModule {}
