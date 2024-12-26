import {
  IsEmail,
  IsEnum,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IsPassword } from '../../../common/decorators/is-password.decorator';

export class SignUpRequestDto {
  @ApiProperty()
  @IsEmail()
  public readonly email: string;

  @ApiProperty()
  @IsPassword()
  public readonly password: string;

  @ApiProperty()
  @IsString()
  @MinLength(3)
  @MaxLength(64)
  public readonly fullName: string;

  @ApiProperty({
    enum: ['member', 'company'],
  })
  @IsEnum(['member', 'company'])
  public readonly role: 'member' | 'company';
}
