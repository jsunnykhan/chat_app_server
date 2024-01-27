import { IsString } from 'class-validator';
import { LoginDto } from './login.dto';

export type AuthProvider = 'local' | 'google';

export interface IRegisterPayload {
  access: string;
  refresh: string;
}

export class RegisterDto extends LoginDto {
  @IsString()
  provider: AuthProvider;
}
