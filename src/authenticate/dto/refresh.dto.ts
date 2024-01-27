import { IsString } from 'class-validator';

export class RefreshAuthenticateDto {
  @IsString()
  refresh: string;
}
