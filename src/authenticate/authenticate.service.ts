import {
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { IRegisterPayload, RegisterDto } from './dto/register.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { Password } from './entities/password.entity';
import * as bcrypt from 'bcrypt';
import { Algorithm, sign, decode } from 'jsonwebtoken';
import { RefreshAuthenticateDto } from './dto/refresh.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthenticateService {
  constructor(
    @InjectRepository(User)
    private readonly userDataSource: Repository<User>,
    @InjectRepository(Password)
    private readonly passwordDataSource: Repository<Password>,
    private config: ConfigService,
  ) {}

  async register(
    createAuthenticateDto: RegisterDto,
  ): Promise<IRegisterPayload> {
    try {
      const isUser = await this.findUserByEmail(createAuthenticateDto.username);
      if (isUser)
        throw new HttpException('user already register', HttpStatus.FORBIDDEN);
      const hashOptions = await this.createHash(createAuthenticateDto.password);
      const savedUser = await this.saveUser({
        createAuthenticateDto,
        hashOptions,
      });
      if (savedUser) {
        const credentials = await this.createAccessAndRefreshToken(savedUser);
        await this.updateRefreshToken(credentials.refresh, savedUser);
        return credentials;
      } else {
        throw new InternalServerErrorException();
      }
    } catch (error: any) {
      throw error;
    }
  }

  async login(loginAuthenticateDto: LoginDto) {
    try {
      const user = await this.userDataSource.findOne({
        where: { email: loginAuthenticateDto.username },
        relations: ['password'],
      });

      if (!user) throw new HttpException('No user found', HttpStatus.NOT_FOUND);

      const isPasswordValid = await this.verifyPassword(
        loginAuthenticateDto.password,
        user.password,
      );
      if (!isPasswordValid) throw new UnauthorizedException();
      const credentials = await this.createAccessAndRefreshToken(user);
      await this.updateRefreshToken(credentials.refresh, user);
      return credentials;
    } catch (error: any) {
      throw error;
    }
  }

  async refreshToken(refreshDto: RefreshAuthenticateDto) {
    try {
      const decoded: any = decode(refreshDto.refresh);
      if (decoded.exp > Date.now()) throw new UnauthorizedException();
      const user = await this.findUserByUUID(decoded.id);
      if (refreshDto.refresh !== user.refresh)
        throw new ForbiddenException('Access Denied');
      const credentials = await this.createAccessAndRefreshToken(user);
      await this.updateRefreshToken(credentials.refresh, user);
      return credentials;
    } catch (error: any) {
      throw error;
    }
  }

  private async findUserByEmail(username: string) {
    return await this.userDataSource.findOneBy({
      email: username,
    });
  }
  private async findUserByUUID(id: string) {
    return await this.userDataSource.findOneBy({
      uuid: id,
    });
  }

  private async saveUser({
    createAuthenticateDto,
    hashOptions,
  }: {
    createAuthenticateDto: RegisterDto;
    hashOptions: { hash: string; salt: string };
  }) {
    return await this.userDataSource.save({
      email: createAuthenticateDto.username,
      provider: createAuthenticateDto.provider,
      password: {
        hash: hashOptions.hash,
        salt: hashOptions.salt,
      },
    });
  }

  private async updateRefreshToken(refresh: string, user: User) {
    await this.userDataSource.save({
      ...user,
      refresh,
    });
  }

  private async createHash(pass: string) {
    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(pass, salt);
    return { hash, salt };
  }

  private async verifyPassword(
    fromClient: string,
    fromServer: Password,
  ): Promise<boolean> {
    return await bcrypt.compare(fromClient, fromServer.hash);
  }

  private async createJwtToken(user: User, expire: number) {
    const algorithm: Algorithm = 'HS256';
    const privateKey = this.config.get('JWT_SECRET_KEY');
    return sign(
      {
        email: user.email,
        id: user.uuid,
      },
      privateKey,
      {
        algorithm,
        expiresIn: expire,
        issuer: 'server:8000',
      },
    );
  }

  private async createAccessAndRefreshToken(user: User) {
    const token = await this.createJwtToken(
      user,
      Number(this.config.get('ACCESS_TOKEN_EXPIRE_IN_MINUTES')) * 60,
    );

    const refreshToken = await this.createJwtToken(
      user,
      Number(this.config.get('REFRESH_TOKEN_EXPIRE_IN_MINUTES')) * 60,
    );

    return { access: token, refresh: refreshToken };
  }
}
