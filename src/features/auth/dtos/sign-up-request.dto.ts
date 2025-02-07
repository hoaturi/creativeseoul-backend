import { IsEmail, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SignUpRequestDto {
  @ApiProperty()
  @IsEmail()
  public readonly email!: string;

  @ApiProperty()
  @IsString()
  @MinLength(8)
  public readonly password!: string;
}
