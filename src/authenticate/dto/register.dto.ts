import { IsNotEmpty, IsString } from "class-validator";
import { LoginDto } from "./login.dto";

export type AuthProvider = "local" | "google";
export class RegisterDto extends LoginDto {
  @IsString()
  @IsNotEmpty()
  provider: AuthProvider;
}
