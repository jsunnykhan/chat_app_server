import { HttpException, HttpStatus, Inject, Injectable, UnauthorizedException } from "@nestjs/common";

import { RegisterDto } from "./dto/register.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { UserEntity } from "src/user/entities/user.entity";
import { Repository } from "typeorm";
import { PasswordEntity } from "./entities/password.entity";
import * as bcrypt from "bcrypt";
import { Algorithm, decode, sign } from "jsonwebtoken";
import { ConfigService } from "@nestjs/config";
import { AuthEntity } from "./entities/auth.entity";
import { LoginDto } from "./dto/login.dto";
import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { Cache } from "cache-manager";
import { RefreshAuthenticateDto } from "./dto/refresh.dto";

@Injectable()
export class AuthenticateService {
  private accessExpireIn: number;
  private refreshExpireIn: number;
  constructor(
    private config: ConfigService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    @InjectRepository(AuthEntity)
    private readonly authEntity: Repository<AuthEntity>,
  ) {
    this.accessExpireIn = Number(this.config.get("ACCESS_TOKEN_EXPIRE_IN_MINUTES")) * 60;
    this.refreshExpireIn = Number(this.config.get("REFRESH_TOKEN_EXPIRE_IN_MINUTES")) * 60;
  }

  async register({ password, provider, username: email }: RegisterDto): Promise<Partial<UserEntity>> {
    try {
      const isUser = await this.authEntity.findOne({ where: { user: { email: email } } });
      if (isUser) throw new HttpException("user already register", HttpStatus.FORBIDDEN);
      const { hash, salt } = await this.createHash(password);
      const userEntity = new UserEntity({ email });
      const passwordEntity = new PasswordEntity({ hash, salt });
      const auth = new AuthEntity({ provider, password: passwordEntity, user: userEntity });
      const { id, password: pass, user, refresh, ...rest } = await this.authEntity.save(auth);
      return { ...rest, email: user.email };
    } catch (error) {
      throw error;
    }
  }

  async login({ password, username }: LoginDto) {
    try {
      const auth = await this.authEntity.findOne({
        where: { user: { email: username } },
        relations: ["password", "user"],
      });
      if (!auth) throw new HttpException("No user found", HttpStatus.NOT_FOUND);
      const isPasswordValid = await bcrypt.compare(password, auth.password.hash);
      if (!isPasswordValid) throw new UnauthorizedException();
      const credentials = await this.createAccessAndRefreshToken({ email: auth.user.email, id: auth.user.uuid });
      await this.authEntity.update(auth.id, { refresh: credentials.refresh });
      await this.cacheManager.set(auth.user.uuid, credentials.refresh, this.refreshExpireIn * 1000);
      return credentials;
    } catch (error) {
      throw error;
    }
  }

  async refreshToken(refreshDto: RefreshAuthenticateDto) {
    try {
      const payload: any = decode(refreshDto.refresh);
      if (payload.exp > Date.now()) throw new UnauthorizedException();
      const isTokenExits = await this.cacheManager.get(payload.id);
      if (!isTokenExits) throw new UnauthorizedException();
      const auth = await this.authEntity.findOne({ where: { user: { uuid: payload.id } }, relations: ["user"] });
      const { email, uuid } = auth.user;
      const credentials = await this.createAccessAndRefreshToken({ email, id: uuid });
      await this.cacheManager.set(auth.user.uuid, credentials.refresh, this.refreshExpireIn * 1000);
      return credentials;
    } catch (error) {
      throw error;
    }
  }

  private async createHash(pass: string) {
    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(pass, salt);
    return { hash, salt };
  }

  private async signTokenAsync(user: { email: string; id: string }, expire: number) {
    const algorithm: Algorithm = "HS256";
    const privateKey = this.config.get("JWT_SECRET_KEY");
    const securityOptions = { algorithm, expiresIn: expire, issuer: "server:8000" };
    return sign(user, privateKey, securityOptions);
  }

  private async createAccessAndRefreshToken(user: { email: string; id: string }) {
    const token = await this.signTokenAsync(user, this.accessExpireIn);
    const refreshToken = await this.signTokenAsync(user, this.refreshExpireIn);
    return { access: token, refresh: refreshToken };
  }
}
