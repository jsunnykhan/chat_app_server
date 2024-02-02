import { Controller, Post, Body, UseInterceptors } from '@nestjs/common';
import { AuthenticateService } from './authenticate.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { RefreshAuthenticateDto } from './dto/refresh.dto';
import { CacheInterceptor } from '@nestjs/cache-manager';
@UseInterceptors(CacheInterceptor)
@Controller('authenticate')
export class AuthenticateController {
  constructor(private readonly authenticateService: AuthenticateService) {}

  @Post('register')
  async register(@Body() createAuthenticateDto: RegisterDto) {
    return await this.authenticateService.register(createAuthenticateDto);
  }
  @Post('login')
  async login(@Body() loginAuthenticateDto: LoginDto) {
    return await this.authenticateService.login(loginAuthenticateDto);
  }
  @Post('refresh')
  async refresh(@Body() refreshTokenDto: RefreshAuthenticateDto) {
    return await this.authenticateService.refreshToken(refreshTokenDto);
  }
}
