import { IsNotEmpty, IsString } from "class-validator";

export class RefreshAuthenticateDto {
  @IsString()
  @IsNotEmpty()
  refresh: string;
}
