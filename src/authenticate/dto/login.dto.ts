import { IsEmail, IsString } from 'class-validator';

export class LoginDto {
  @IsEmail({ domain_specific_validation: true })
  username: string;

  @IsString()
  password: string;
}
