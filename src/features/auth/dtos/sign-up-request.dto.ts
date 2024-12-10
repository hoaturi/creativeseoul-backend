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
  @MaxLength(256)
  public readonly email: string;

  @ApiProperty()
  @IsPassword()
  public readonly password: string;

  @ApiProperty()
  @IsString()
  @MinLength(3)
  @MaxLength(16)
  public readonly userName: string;

  @ApiProperty({
    enum: ['candidate', 'employer'],
  })
  @IsEnum(['candidate', 'employer'])
  public readonly role: 'candidate' | 'employer';
}
