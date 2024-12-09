import {
  IsEmail,
  IsEnum,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SignUpRequestDto {
  @ApiProperty()
  @IsEmail()
  @MaxLength(256)
  public readonly email: string;

  @ApiProperty()
  @IsString()
  @Matches(/^[a-zA-Z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]*$/, {
    message:
      'Password can only contain letters, numbers and special characters',
  })
  @MinLength(8)
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
