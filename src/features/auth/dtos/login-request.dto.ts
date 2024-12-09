import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

export class LoginRequestDto {
  @ApiProperty()
  @IsEmail()
  @MaxLength(256)
  public readonly email: string;

  @ApiProperty()
  @IsString()
  @MinLength(8)
  public readonly password: string;
}
