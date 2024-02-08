import { Controller, Post, Body, UseInterceptors } from "@nestjs/common";
import { AuthenticateService } from "./authenticate.service";
import { LoginDto } from "./dto/login.dto";
import { RegisterDto } from "./dto/register.dto";
import { RefreshAuthenticateDto } from "./dto/refresh.dto";
import { CacheInterceptor } from "@nestjs/cache-manager";

@Controller("authenticate")
export class AuthenticateController {
  constructor(private readonly authenticateService: AuthenticateService) {}

  @Post("register")
  async register(@Body() registerDto: RegisterDto) {
    return await this.authenticateService.register(registerDto);
  }

  @Post("login")
  async login(@Body() loginDto: LoginDto) {
    return await this.authenticateService.login(loginDto);
  }

  @Post("refresh")
  async refresh(@Body() refreshTokenDto: RefreshAuthenticateDto) {
    return await this.authenticateService.refreshToken(refreshTokenDto);
  }
}
