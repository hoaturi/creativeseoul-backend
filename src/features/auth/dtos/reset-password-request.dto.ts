import { IsEmail, IsString } from 'class-validator';

export class ResetPasswordRequestDto {
  @IsEmail()
  public readonly email: string;

  @IsString()
  public readonly password: string;

  @IsString()
  public readonly confirmPassword: string;

  @IsString()
  public readonly token: string;
}
